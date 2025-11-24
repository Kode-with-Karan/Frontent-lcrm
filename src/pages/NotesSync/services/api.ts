import { config } from "../../../config/env";

const API_BASE_URL = config.apiBaseUrl;

export interface NotionRichText {
  type: string;
  text: {
    content: string;
    link?: string | null;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href?: string | null;
}

export interface Database {
  id: string;
  title: string; // After processing, this will always be a string
  description?: string;
  icon?: string | null; // After processing, this will be a string emoji or null
  url?: string;
  created_time?: string;
  last_edited_time: string;
}

// Utility function to extract plain text from Notion rich text objects
export const extractNotionText = (
  richText: NotionRichText[] | string | undefined | null | any
): string => {
  if (!richText) return "";
  if (typeof richText === "string") return richText;
  if (Array.isArray(richText)) {
    return richText
      .map((t) => {
        if (typeof t === "string") return t;
        if (t && typeof t === "object") {
          return t.plain_text || t.text?.content || "";
        }
        return "";
      })
      .join("");
  }
  if (richText && typeof richText === "object" && "plain_text" in richText) {
    return (richText as any).plain_text || "";
  }
  return "";
};

export interface Page {
  id: string;
  title: string;
  database_id?: string;
  last_edited_time: string;
  content_preview?: string;
  url?: string;
  properties?: any;
}

export interface GeneratedPost {
  id: string;
  content: string;
  sourceType: "notion" | "google_docs" | "manual";
  sourceId?: string;
  tone: string;
  createdAt: string;
  isScheduled: boolean;
  scheduledDate?: string;
  originalContent?: string;
  wordCount?: number;
}

export interface NotionConnectionResponse {
  success: boolean;
  message: string;
  workspaceName?: string;
}

export interface DatabasesResponse {
  databases: Database[];
}

export interface PagesResponse {
  pages: Page[];
}

export interface PageContentResponse {
  content: string;
}

export interface PostGenerationResponse {
  success: boolean;
  generatedPost: string;
  wordCount: number;
  originalContent: string;
}

class NotionAPI {
  async initiateConnection(userId: string): Promise<NotionConnectionResponse> {
    // Get Notion client ID from environment variables
    const clientId = config.notion.clientId;
    const redirectUri = encodeURIComponent(config.notion.redirectUri);

    if (!clientId) {
      throw new Error(
        "Notion Client ID not configured. Please set VITE_NOTION_CLIENT_ID in your .env file."
      );
    }

    const state = userId;

    const oauthUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user&redirect_uri=${redirectUri}&state=${state}`;

    // Open OAuth popup
    const popup = window.open(
      oauthUrl,
      "notion-oauth",
      "width=600,height=700,scrollbars=yes,resizable=yes"
    );

    if (!popup) {
      throw new Error(
        "Failed to open popup. Please allow popups for this site."
      );
    }

    return new Promise((resolve, reject) => {
      // Listen for OAuth callback via postMessage
      const handleMessage = (event: MessageEvent) => {
        // Only accept messages from our frontend origin
        if (event.origin !== window.location.origin) return;
        if (event.data.type === "NOTION_OAUTH_SUCCESS") {
          clearInterval(checkClosed);
          window.removeEventListener("message", handleMessage);
          popup.close();
          this.handleOAuthCallback(event.data.code, event.data.state || userId)
            .then(resolve)
            .catch(reject);
        } else if (event.data.type === "NOTION_OAUTH_ERROR") {
          clearInterval(checkClosed);
          window.removeEventListener("message", handleMessage);
          popup.close();
          reject(new Error(event.data.error));
        }
      }; // Monitor popup for URL changes
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener("message", handleMessage);
          reject(new Error("OAuth cancelled by user"));
        }

        try {
          // Check if popup URL contains our callback
          if (popup.location.href.includes("/notion-callback")) {
            const url = new URL(popup.location.href);
            const code = url.searchParams.get("code");
            const state = url.searchParams.get("state");
            const error = url.searchParams.get("error");

            if (error) {
              clearInterval(checkClosed);
              popup.close();
              reject(new Error(decodeURIComponent(error)));
              return;
            }

            if (code) {
              clearInterval(checkClosed);
              popup.close();
              this.handleOAuthCallback(code, state || userId)
                .then(resolve)
                .catch(reject);
            }
          }
        } catch (e) {
          // Cross-origin error - this is expected until we reach our callback
        }
      }, 1000);

      window.addEventListener("message", handleMessage);

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(checkClosed);
        window.removeEventListener("message", handleMessage);
        if (!popup.closed) {
          popup.close();
        }
        reject(new Error("OAuth timeout"));
      }, 300000);
    });
  }
  async handleOAuthCallback(
    code: string,
    userId: string
  ): Promise<NotionConnectionResponse> {
    console.log("=== FRONTEND OAUTH DEBUG ===");
    console.log("Sending to backend:", { code, userId });
    console.log("UserId type:", typeof userId);
    console.log("UserId length:", userId?.length);
    console.log("============================");

    const response = await fetch(`${API_BASE_URL}/notion/auth/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, userId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.details || error.error || "Failed to connect Notion"
      );
    }

    return response.json();
  }
  async getDatabases(userId: string): Promise<DatabasesResponse> {
    const response = await fetch(`${API_BASE_URL}/notion/databases/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch databases");
    }

    const data = await response.json(); // Process the databases to ensure titles, icons, and descriptions are properly extracted
    if (data.databases && Array.isArray(data.databases)) {
      data.databases = data.databases.map((database: any) =>
        sanitizeDatabase(database)
      );
    }

    return data;
  }
  async getPages(userId: string, databaseId?: string): Promise<PagesResponse> {
    const url = new URL(`${API_BASE_URL}/notion/pages/${userId}`);
    if (databaseId) {
      url.searchParams.append("databaseId", databaseId);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch pages");
    }

    const data = await response.json(); // Process pages to ensure proper title extraction
    if (data.pages && Array.isArray(data.pages)) {
      data.pages = data.pages.map((page: any) => ({
        ...page,
        title: extractNotionText(
          page.properties?.title?.title ||
            page.properties?.Name?.title ||
            (
              Object.values(page.properties || {}).find(
                (prop: any) => prop.type === "title"
              ) as any
            )?.title ||
            "Untitled Page"
        ),
      }));
    }

    return data;
  }

  async getSubpages(userId: string, pageId: string): Promise<PagesResponse> {
    const response = await fetch(
      `${API_BASE_URL}/notion/subpages/${userId}/${pageId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch subpages");
    }

    const data = await response.json();
    // Process subpages to ensure proper title extraction
    if (data.subpages && Array.isArray(data.subpages)) {
      data.subpages = data.subpages.map((page: any) => ({
        ...page,
        title: extractNotionText(
          page.properties?.title?.title ||
            page.properties?.Name?.title ||
            (
              Object.values(page.properties || {}).find(
                (prop: any) => prop.type === "title"
              ) as any
            )?.title ||
            "Untitled Page"
        ),
      }));
    }

    return { pages: data.subpages };
  }

  async getPageContent(
    userId: string,
    pageId: string
  ): Promise<PageContentResponse> {
    const response = await fetch(
      `${API_BASE_URL}/notion/page-content/${userId}/${pageId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch page content");
    }

    return response.json();
  }

  async generatePost(
    userId: string,
    content: string,
    tone: string = "storytelling",
    goal: string = "engagement"
  ): Promise<PostGenerationResponse> {
    const response = await fetch(`${API_BASE_URL}/generateFromNote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        content,
        tone,
        goal,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to generate post");
    }

    return response.json();
  }
  // Utility method to test backend connection
  async testConnection(): Promise<{ message: string; database: string }> {
    const response = await fetch(`${API_BASE_URL}/notion/test`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Backend connection failed");
    }

    return response.json();
  }
}

// Utility function to sanitize database data to ensure no complex objects are passed to React
export const sanitizeDatabase = (database: any): Database => {
  return {
    id: database.id || "",
    title: extractNotionText(database.title) || "Untitled Database",
    description: database.description
      ? extractNotionText(database.description)
      : undefined,
    icon:
      database.icon && typeof database.icon === "object" && database.icon.emoji
        ? database.icon.emoji
        : typeof database.icon === "string"
        ? database.icon
        : null,
    url:
      database.url && typeof database.url === "object" && database.url.external
        ? database.url.external
        : typeof database.url === "string"
        ? database.url
        : undefined,
    created_time:
      typeof database.created_time === "string"
        ? database.created_time
        : undefined,
    last_edited_time: database.last_edited_time || new Date().toISOString(),
  };
};

export const notionApi = new NotionAPI();

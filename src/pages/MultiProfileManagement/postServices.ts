import { config } from "../../config/env";

// Temporary post types and services for the multi-profile content management
export type PostStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "scheduled"
  | "published"
  | "rejected"
  | "failed";

export interface PostAnalytics {
  likes: number;
  comments: number;
  shares: number;
  views: number;
  clicks?: number;
  lastUpdated?: string;
}

export interface Post {
  _id: string;
  profileId: string;
  authorId: string;
  content: string;
  scheduledDate?: string;
  publishedAt?: string;
  status: PostStatus;
  hashtags?: string[];
  analytics?: PostAnalytics;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = config.apiBaseUrl;

class PostService {
  async getProfilePosts(
    profileId: string,
    status?: PostStatus
  ): Promise<Post[]> {
    try {
      const url = new URL(`${API_BASE_URL}/posts/profile/${profileId}`);
      if (status) {
        url.searchParams.append("status", status);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }

      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Error fetching profile posts:", error);
      return [];
    }
  }

  async createPost(postData: {
    profileId: string;
    content: string;
    scheduledDate?: string;
    hashtags?: string[];
    mediaUrls?: string[];
    authorName?: string;
  }): Promise<Post | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create post: ${response.statusText}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Error creating post:", error);
      return null;
    }
  }

  async updatePost(
    postId: string,
    updateData: {
      content?: string;
      scheduledDate?: string;
      hashtags?: string[];
      mediaUrls?: string[];
      status?: PostStatus;
    }
  ): Promise<Post | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update post: ${response.statusText}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Error updating post:", error);
      return null;
    }
  }

  async deletePost(postId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.statusText}`);
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Error deleting post:", error);
      return false;
    }
  }

  async getPostById(postId: string): Promise<Post | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/demo`);
      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.statusText}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Error fetching post:", error);
      return null;
    }
  }

  // NEW: Import posts from LinkedIn
  async importLinkedInPosts(
    profileId: string,
    limit: number = 20
  ): Promise<{
    imported: number;
    skipped: number;
    total: number;
    posts: Post[];
  } | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/linkedin/import-posts/${profileId}?limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to import LinkedIn posts: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Error importing LinkedIn posts:", error);
      return null;
    }
  }

  // NEW: Sync analytics for LinkedIn posts
  async syncLinkedInAnalytics(profileId: string): Promise<{
    totalPosts: number;
    updated: number;
    failed: number;
  } | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/linkedin/sync-analytics/${profileId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to sync LinkedIn analytics: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Error syncing LinkedIn analytics:", error);
      return null;
    }
  }
}

export const postService = new PostService();

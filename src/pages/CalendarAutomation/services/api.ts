import { config } from "../../../config/env";

const API_BASE_URL = config.apiBaseUrl;

export interface Post {
  _id: string;
  title: string;
  content: string;
  theme: string;
  scheduledDate: string;
  scheduledTime: string;
  hashtags: string[];
  status: "draft" | "scheduled" | "published";
  userId: string;
  generatedBy: "AI" | "User";
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  notes?: string;
}

export interface UserPreferences {
  userId: string;
  industry: string;
  role: string;
  targetAudience: string;
  businessGoals: string[];
  contentTone: string;
  preferredPostingTimes: string[];
  customPrompts: string[];
  contentPreferences: {
    includeEmojis: boolean;
    includeHashtags: boolean;
    maxHashtags: number;
    includeQuestions: boolean;
    includeCTA: boolean;
    preferredPostLength: "short" | "medium" | "long";
  };
  weeklySchedule: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
}

// Calendar API functions
export const calendarAPI = {
  // Generate multiple posts
  async autoGenerate(config: {
    userId: string;
    customTopics?: string[];
    numberOfPosts?: number;
    startDate?: string;
    userInputs?: any;
  }): Promise<{ success: boolean; posts: Post[]; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/calendar/autoGenerate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("AutoGenerate response:", data);
      
      return {
        success: data.success || false,
        posts: data.posts || [],
        message: data.message || "Posts generated successfully"
      };
    } catch (error) {
      console.error("Error generating posts:", error);
      throw error;
    }
  },

  // Get posts for a date range
  async getPosts(
    userId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Post[]> {
    try {
      const params = new URLSearchParams({ userId });
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await fetch(`${API_BASE_URL}/calendar/posts?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle both response formats: direct array or wrapped in success object
      if (data.success && data.posts) {
        return data.posts;
      } else if (Array.isArray(data)) {
        return data;
      } else {
        console.warn("Unexpected response format:", data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  },

  // Update a post
  async updatePost(postId: string, updates: Partial<Post>): Promise<Post> {
    try {
      const response = await fetch(`${API_BASE_URL}/calendar/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  },

  // Delete a post
  async deletePost(postId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/calendar/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  },

  // Bulk update posts
  async bulkUpdate(postIds: string[], updates: Partial<Post>): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/calendar/bulk-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postIds, updates }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error bulk updating posts:", error);
      throw error;
    }
  },

  // Drag and drop post to new date
  async dragPost(
    postId: string,
    newDate: Date,
    newTime?: string
  ): Promise<Post> {
    try {
      const response = await fetch(`${API_BASE_URL}/calendar/drag-drop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          newDate: newDate.toISOString(),
          newTime,
          userId: "demo-user", // This should come from auth context
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.post;
    } catch (error) {
      console.error("Error dragging post:", error);
      throw error;
    }
  },

  // Bulk operations
  async bulkOperation(
    operation: string,
    postIds: string[],
    data?: any
  ): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/calendar/bulk-operations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operation,
          postIds,
          data,
          userId: "demo-user", // This should come from auth context
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error in bulk operation:", error);
      throw error;
    }
  },

  // Smart scheduling
  async smartSchedule(posts: any[], preferences?: any): Promise<Post[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/calendar/smart-schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "demo-user", // This should come from auth context
          posts,
          preferences,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.posts;
    } catch (error) {
      console.error("Error in smart schedule:", error);
      throw error;
    }
  },

  // Get analytics
  async getAnalytics(period = "month"): Promise<any> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/calendar/analytics?userId=demo-user&period=${period}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching analytics:", error);
      throw error;
    }
  },

  // Duplicate week
  async duplicateWeek(sourceWeekStart: string): Promise<Post[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/calendar/duplicate-week`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: "demo-user", sourceWeekStart }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error duplicating week:", error);
      throw error;
    }
  },
};

// Posts API functions
export const postsAPI = {
  // Get all posts for a user
  async getPosts(userId: string): Promise<Post[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts?userId=${userId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  },

  // Get a single post
  async getPost(postId: string): Promise<Post> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching post:", error);
      throw error;
    }
  },

  // Create a new post
  async createPost(post: Omit<Post, "_id">): Promise<Post> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  // Update a post
  async updatePost(postId: string, updates: Partial<Post>): Promise<Post> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  },

  // Delete a post
  async deletePost(postId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  },

  // Update post status
  async updatePostStatus(
    postId: string,
    status: "draft" | "scheduled" | "published"
  ): Promise<Post> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating post status:", error);
      throw error;
    }
  },

  // Get post statistics
  async getPostStats(userId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/stats/${userId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching post stats:", error);
      throw error;
    }
  },
};

// Preferences API functions
export const preferencesAPI = {
  // Get user preferences
  async getPreferences(userId: string): Promise<UserPreferences> {
    try {
      const response = await fetch(`${API_BASE_URL}/calendar/preferences/${userId}`);

      if (!response.ok) {
        if (response.status === 404) {
          // Return default preferences if user doesn't have any
          return {
            userId,
            industry: "Technology",
            role: "Founder",
            targetAudience: "Professionals",
            businessGoals: ["Brand Awareness", "Lead Generation"],
            contentTone: "Professional",
            preferredPostingTimes: ["09:00", "13:00", "17:00"],
            customPrompts: [],
            contentPreferences: {
              includeEmojis: true,
              includeHashtags: true,
              maxHashtags: 5,
              includeQuestions: true,
              includeCTA: true,
              preferredPostLength: "medium" as const,
            },
            weeklySchedule: {
              monday: true,
              tuesday: true,
              wednesday: true,
              thursday: true,
              friday: true,
              saturday: false,
              sunday: false,
            },
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching preferences:", error);
      throw error;
    }
  },

  // Update user preferences
  async updatePreferences(
    userId: string,
    updates: Partial<UserPreferences>
  ): Promise<UserPreferences> {
    try {
      const response = await fetch(`${API_BASE_URL}/calendar/preferences/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating preferences:", error);
      throw error;
    }
  },

  // Create user preferences
  async createPreferences(
    preferences: UserPreferences
  ): Promise<UserPreferences> {
    try {
      const response = await fetch(`${API_BASE_URL}/calendar/preferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating preferences:", error);
      throw error;
    }
  },

  // Delete user preferences
  async deletePreferences(userId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/calendar/preferences/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting preferences:", error);
      throw error;
    }
  },

  // Update posting times
  async updatePostingTimes(
    userId: string,
    preferredPostingTimes: string[]
  ): Promise<UserPreferences> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/preferences/${userId}/posting-times`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ preferredPostingTimes }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating posting times:", error);
      throw error;
    }
  },

  // Update custom prompts
  async updateCustomPrompts(
    userId: string,
    customPrompts: string[]
  ): Promise<UserPreferences> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/preferences/${userId}/custom-prompts`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ customPrompts }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating custom prompts:", error);
      throw error;
    }
  },

  // Get default values
  async getDefaults(): Promise<{
    roles: string[];
    tones: string[];
    industries: string[];
  }> {
    try {
      const [rolesRes, tonesRes, industriesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/preferences/defaults/roles`),
        fetch(`${API_BASE_URL}/preferences/defaults/tones`),
        fetch(`${API_BASE_URL}/preferences/defaults/industries`),
      ]);

      const [rolesData, tonesData, industriesData] = await Promise.all([
        rolesRes.json(),
        tonesRes.json(),
        industriesRes.json(),
      ]);

      return {
        roles: rolesData.roles,
        tones: tonesData.tones,
        industries: industriesData.industries,
      };
    } catch (error) {
      console.error("Error fetching defaults:", error);
      throw error;
    }
  },
};

// Helper functions
export const utils = {
  // Format date for display
  formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  // Format time for display
  formatTime(time: string): string {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  },

  // Calculate days between dates
  daysBetween(start: string | Date, end: string | Date): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  },

  // Get theme color
  getThemeColor(theme: string): string {
    const colors = {
      Educational: "#3B82F6",
      "Personal Story": "#8B5CF6",
      Insight: "#10B981",
      Question: "#F59E0B",
      CTA: "#EF4444",
      Tips: "#6366F1",
      "Industry News": "#EC4899",
    };
    return colors[theme as keyof typeof colors] || "#6B7280";
  },

  // Validate post content
  validatePost(post: Partial<Post>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!post.content || post.content.trim().length === 0) {
      errors.push("Content is required");
    }

    if (post.content && post.content.length > 1300) {
      errors.push("Content exceeds 1300 character limit");
    }

    if (!post.theme) {
      errors.push("Theme is required");
    }

    if (!post.scheduledDate) {
      errors.push("Scheduled date is required");
    }

    if (!post.scheduledTime) {
      errors.push("Scheduled time is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

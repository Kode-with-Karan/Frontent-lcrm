import { config } from "../../config/env";

export interface ProfileData {
  headline?: string;
  summary?: string;
  profilePicture?: string;
  industry?: string;
  location?: string;
  connections?: number;
  experience?: Array<{
    title: string;
    company: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
  }>;
}

export interface Profile {
  _id: string;
  userId: string;
  linkedinId: string;
  profileName: string;
  profileUrl: string;
  profileData: ProfileData;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt: string;
  isActive: boolean;
  status?: "active" | "expired" | "error";
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

class ProfileService {
  private getAuthHeaders() {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Optional: Add auth token if available (but don't require it)
    const token = localStorage.getItem("authToken");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  async getProfiles(): Promise<Profile[]> {
    const response = await fetch(`${config.apiBaseUrl}/profiles`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<Profile[]> = await response.json();

    if (data.success) {
      return data.data || [];
    } else {
      throw new Error(data.error?.message || "Failed to fetch profiles");
    }
  }

  async getProfile(profileId: string): Promise<Profile> {
    const response = await fetch(`${config.apiBaseUrl}/profiles/${profileId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<Profile> = await response.json();

    if (data.success && data.data) {
      return data.data;
    } else {
      throw new Error(data.error?.message || "Failed to fetch profile");
    }
  }

  async getLinkedInAuthUrl(): Promise<string> {
    const response = await fetch(`${config.apiBaseUrl}/linkedin/auth-url`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<{ authUrl: string }> = await response.json();

    if (data.success && data.data?.authUrl) {
      return data.data.authUrl;
    } else {
      throw new Error(
        data.error?.message || "Failed to generate LinkedIn authorization URL"
      );
    }
  }

  async activateProfile(profileId: string): Promise<Profile> {
    const response = await fetch(
      `${config.apiBaseUrl}/profiles/${profileId}/activate`,
      {
        method: "PATCH",
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<Profile> = await response.json();

    if (data.success && data.data) {
      return data.data;
    } else {
      throw new Error(data.error?.message || "Failed to activate profile");
    }
  }

  async updateProfile(
    profileId: string,
    updateData: {
      name?: string;
      headline?: string;
      location?: string;
      linkedin_url?: string;
      avatar_url?: string;
    }
  ): Promise<Profile> {
    const response = await fetch(`${config.apiBaseUrl}/profiles/${profileId}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<Profile> = await response.json();

    if (data.success && data.data) {
      return data.data;
    } else {
      throw new Error(data.error?.message || "Failed to update profile");
    }
  }

  async createProfile(profileData: {
    linkedinId: string;
    profileName: string;
    accessToken: string;
    profileData: ProfileData;
    profileUrl?: string;
    tokenExpiresAt?: string;
  }): Promise<Profile> {
    const response = await fetch(`${config.apiBaseUrl}/profiles`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<Profile> = await response.json();

    if (data.success && data.data) {
      return data.data;
    } else {
      throw new Error(data.error?.message || "Failed to create profile");
    }
  }

  async deleteProfile(profileId: string): Promise<void> {
    const response = await fetch(`${config.apiBaseUrl}/profiles/${profileId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<any> = await response.json();

    if (!data.success) {
      throw new Error(data.error?.message || "Failed to delete profile");
    }
  }
}

export const profileService = new ProfileService();

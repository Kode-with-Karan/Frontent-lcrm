// Environment configuration for the frontend application

export const config = {
  // API Configuration - prioritize deployed backend, fallback to localhost
  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL || "https://dashboard.klype.io/api",

  // Notion Integration
  notion: {
    clientId: import.meta.env.VITE_NOTION_CLIENT_ID,
    redirectUri:
      import.meta.env.VITE_NOTION_REDIRECT_URI!,
      // || "http://localhost:5173/notion-callback",
  },

  // LinkedIn Integration
  linkedin: {
    clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID,
    redirectUri:
      import.meta.env.VITE_LINKEDIN_REDIRECT_URI ||
      "http://localhost:5173/linkedin-callback",
  },

  // Development settings
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

// Validation function to check required environment variables
export const validateEnvironment = () => {
  const errors: string[] = [];

  if (!config.notion.clientId) {
    errors.push("VITE_NOTION_CLIENT_ID is required for Notion integration");
  }

  if (!config.apiBaseUrl) {
    errors.push("VITE_API_BASE_URL is required for backend communication");
  }

  if (errors.length > 0) {
    console.warn("Environment configuration warnings:", errors);
    return false;
  }

  return true;
};

// Helper function to get backend base URL without /api suffix
export const getBackendBaseUrl = () => {
  return config.apiBaseUrl.replace("/api", "");
};

// Type for environment configuration
export type Config = typeof config;

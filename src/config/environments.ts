// Environment switcher utility for easy backend switching
export const environments = {
  production: {
    name: "Production (Deployed)",
    apiBaseUrl: "https://dashboard.klype.io/api",
    backendBaseUrl: "https://dashboard.klype.io",
  },
  local: {
    name: "Local Development",
    apiBaseUrl: "http://localhost:3002/api",
    backendBaseUrl: "http://localhost:3002",
  },
} as const;

export type Environment = keyof typeof environments;

// Get current environment based on environment variables
export const getCurrentEnvironment = (): Environment => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "";
  if (apiUrl.includes("dashboard.klype.io")) {
    return "production";
  }
  return "local";
};

// Get environment info
export const getEnvironmentInfo = () => {
  const currentEnv = getCurrentEnvironment();
  return {
    current: currentEnv,
    info: environments[currentEnv],
    all: environments,
  };
};

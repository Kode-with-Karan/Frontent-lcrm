import { useNavigate } from "react-router-dom";

// All features data for global search
export const allFeatures = [
  // Main features
  {
    title: "YouTube Shorts to Post Converter",
    description: "Transform YouTube Shorts into engaging social media posts",
    path: "/youtube-converter",
    type: "main" as const,
    keywords: ["youtube", "yt", "shorts", "video", "converter"],
  },
  {
    title: "Generate Viral Posts on LinkedIn",
    description: "Create compelling LinkedIn content that drives engagement",
    path: "/viral-search",
    type: "main" as const,
    keywords: ["viral", "linkedin", "posts", "engagement"],
  },
  {
    title: "7-Days Personalized Content Calendar",
    description: "Plan your content strategy with AI-powered scheduling",
    path: "/calendar-automation",
    type: "main" as const,
    keywords: ["calendar", "schedule", "planning", "content"],
  },
  {
    title: "Create a Post",
    description: "Generate custom posts tailored to your audience",
    path: "/create-post",
    type: "main" as const,
    keywords: ["create", "post", "generate", "custom"],
  },
  // Premium features
  {
    title: "Role-Based Content Personalization",
    description: "Customize content based on user roles and audience segments",
    path: "/role-personalization",
    type: "premium" as const,
    keywords: ["role", "personalization", "audience", "segments"],
  },
  {
    title: "KLYPE CHAT",
    description: "Personalized posts via KLYPE Agent",
    path: "/klype-chat",
    type: "premium" as const,
    keywords: ["chat", "klype", "agent", "ai"],
  },
  {
    title: "Convert Voice notes into Posts",
    description: "Transform voice recordings into publish-ready posts",
    path: "/voice-to-post",
    type: "premium" as const,
    keywords: ["voice", "audio", "recording", "notes"],
  },
  {
    title: "LinkedIn Profile Generator",
    description: "Upgrade your LinkedIn profile to stand out and get noticed",
    path: "/profile-analyzer",
    type: "premium" as const,
    keywords: ["linkedin", "profile", "generator", "upgrade"],
  },
  {
    title: "Reference-Based Post Cloning",
    description: "Clone and adapt content based on successful references",
    path: "/reference-cloning",
    type: "premium" as const,
    keywords: ["reference", "clone", "adapt", "content"],
  },
  {
    title: "Full Calendar Automation",
    description: "Automate your entire content calendar workflow",
    path: "/calendar-automation",
    type: "premium" as const,
    keywords: ["calendar", "automation", "workflow", "schedule"],
  },
  {
    title: "Inbox Post Delivery",
    description:
      "Automatically send posts to email or inboxes for collaboration",
    path: "/inbox-delivery",
    type: "premium" as const,
    keywords: ["inbox", "email", "delivery", "collaboration"],
  },
  {
    title: "Strategic Goal-Based Content Generator",
    description: "Generate content aligned with your business objectives",
    path: "/goal-based-content",
    type: "premium" as const,
    keywords: ["goal", "strategic", "business", "objectives"],
  },
  {
    title: "Notes Sync",
    description: "Sync notes across devices for seamless content creation",
    path: "/notes-sync",
    type: "premium" as const,
    keywords: ["notes", "sync", "devices", "seamless"],
  },
  {
    title: "Reddit Post Cloning",
    description: "Clone and adapt content from Reddit for LinkedIn",
    path: "/reddit-post-cloning",
    type: "premium" as const,
    keywords: ["reddit", "clone", "content", "forum"],
  },
];

// Global search function
export const globalSearch = (query: string) => {
  if (!query.trim()) return [];

  const searchTerm = query.toLowerCase().trim();

  return allFeatures.filter((feature) => {
    // Primary search in title and description
    const titleMatch = feature.title.toLowerCase().includes(searchTerm);
    const descriptionMatch = feature.description
      .toLowerCase()
      .includes(searchTerm);

    // Keyword search
    const keywordMatch = feature.keywords.some(
      (keyword) =>
        keyword.toLowerCase().includes(searchTerm) ||
        searchTerm.includes(keyword.toLowerCase())
    );

    return titleMatch || descriptionMatch || keywordMatch;
  });
};

// Search suggestions component
export interface SearchSuggestion {
  title: string;
  description: string;
  path: string;
  type: "main" | "premium";
}

export const useGlobalSearch = () => {
  const navigate = useNavigate();

  const navigateToFeature = (path: string) => {
    navigate(path);
  };

  return {
    search: globalSearch,
    navigateToFeature,
    allFeatures,
  };
};

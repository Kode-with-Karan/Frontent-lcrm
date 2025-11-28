// Feature descriptions for different pages
export const featureDescriptions: { [key: string]: string } = {
  "/": "Welcome back! Here are your tools and insights.",
  "/dashboard": "Welcome back! Here are your tools and insights.",
  "/youtube-converter":
    "Transform YouTube Shorts into engaging social media posts with AI-powered content creation.",
  "/viral-search":
    "Create compelling LinkedIn content that drives engagement and grows your professional network.",
  "/calendar-automation":
    "Plan your content strategy with AI-powered scheduling and automated posting.",
  "/create-post":
    "Generate custom posts tailored to your audience with advanced AI personalization.",
  "/role-personalization":
    "Customize content based on user roles and audience segments for maximum impact.",
  "/klype-chat":
    "Get personalized posts via LinkedIn CRM Agent - your AI-powered content creation assistant.",
  "/voice-to-post":
    "Transform voice recordings into publish-ready posts with AI transcription and optimization.",
  "/profile-analyzer":
    "Upgrade your LinkedIn profile to stand out and get noticed by recruiters and connections.",
  "/reference-cloning":
    "Clone and adapt content based on successful references to boost your engagement.",
  "/inbox-delivery":
    "Automatically send posts to email or inboxes for seamless team collaboration.",
  "/goal-based-content":
    "Generate content aligned with your business objectives and strategic goals.",
  "/notes-sync":
    "Sync notes across devices for seamless content creation and idea management.",
  "/reddit-post-cloning":
    "Clone and adapt viral content from Reddit for your LinkedIn audience.",
};

// Function to get description based on current path
export const getFeatureDescription = (pathname: string): string => {
  return (
    featureDescriptions[pathname] ||
    "Enhance your content creation with AI-powered tools and insights."
  );
};

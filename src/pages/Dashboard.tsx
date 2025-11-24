import React from "react";
import FeatureCard from "../components/FeatureCard";
import Header from "../components/Header";
import Layout from "../components/Layout";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);

  // Debounce search query for better performance
  React.useEffect(() => {
    if (searchQuery !== debouncedSearchQuery) {
      setIsSearching(true);
    }

    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setIsSearching(false);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearchQuery]);

  // Function to filter features based on search query
  const filterFeatures = (features: any[], query: string) => {
    if (!query.trim()) return features;

    const searchTerm = query.toLowerCase().trim();

    return features.filter((feature) => {
      // Primary search in title and description
      const titleMatch = feature.title.toLowerCase().includes(searchTerm);
      const descriptionMatch = feature.description
        .toLowerCase()
        .includes(searchTerm);

      // Smart keyword aliases - only exact matches to avoid false positives
      const smartAliases: { [key: string]: string[] } = {
        yt: ["YouTube Shorts to Post Converter"],
        youtube: ["YouTube Shorts to Post Converter"],
        video: ["YouTube Shorts to Post Converter"],
        shorts: ["YouTube Shorts to Post Converter"],
        linkedin: [
          "Generate Viral Posts on LinkedIn",
          "LinkedIn Profile Generator",
        ],
        profile: ["LinkedIn Profile Generator"],
        calendar: [
          "7-Days Personalized Content Calendar",
          "Full Calendar Automation",
        ],
        voice: ["Convert Voice notes into Posts"],
        audio: ["Convert Voice notes into Posts"],
        recording: ["Convert Voice notes into Posts"],
        chat: ["KLYPE CHAT"],
        klype: ["KLYPE CHAT"],
        viral: ["Generate Viral Posts on LinkedIn"],
        clone: ["Reference-Based Post Cloning", "Reddit Post Cloning"],
        reddit: ["Reddit Post Cloning"],
        inbox: ["Inbox Post Delivery"],
        email: ["Inbox Post Delivery"],
        goal: ["Strategic Goal-Based Content Generator"],
        strategic: ["Strategic Goal-Based Content Generator"],
        notes: ["Convert Voice notes into Posts", "Notes Sync"],
        sync: ["Notes Sync"],
        role: ["Role-Based Content Personalization"],
        automation: [
          "Full Calendar Automation",
          "7-Days Personalized Content Calendar",
        ],
        personalization: ["Role-Based Content Personalization"],
        reference: ["Reference-Based Post Cloning"],
      };

      // Check if search term matches any smart alias
      const aliasMatch = smartAliases[searchTerm]
        ? smartAliases[searchTerm].some((featureTitle) =>
            feature.title.includes(featureTitle)
          )
        : false;

      return titleMatch || descriptionMatch || aliasMatch;
    });
  };

  // Main feature cards data
  const mainFeatures = [
    {
      title: "YouTube Shorts to Post Converter",
      image: "/Free features/YT short to post.png",
      description: "Transform YouTube Shorts into engaging social media posts",
      path: "/youtube-converter",
      time: "3 min",
      iconComponent: undefined,
    },
    {
      title: "Generate Viral Posts on LinkedIn",
      image: "/Free features/Generate Viral Post.png",
      description: "Create compelling LinkedIn content that drives engagement",
      path: "/viral-search",
      isHot: true,
      time: "4 min",
      iconComponent: undefined,
    },
    {
      title: "7-Days Personalized Content Calendar",
      image: "/Free features/7 Days Calendar.png",
      description: "Plan your content strategy with AI-powered scheduling",
      gradient: true,
      path: "/calendar-automation",
      time: "5 min",
      iconComponent: undefined,
    },
    {
      title: "Create a Post",
      image: "/Free features/Create a Post.png",
      description: "Generate custom posts tailored to your audience",
      gradient: true,
      path: "/create-post", // updated path
      isCrown: true,
      time: "2 min",
      iconComponent: undefined,
    },
  ];

  // Premium features data
  const premiumFeatures = [
    {
      title: "Role-Based Content Personalization",
      description:
        "Customize content based on user roles and audience segments",
      icon: "/Premium features icons/Role Based.png",
      gradient: true,
      path: "/role-personalization",
      time: "3 min",
    },
    {
      title: "KLYPE CHAT",
      description: "Personalized posts via KLYPE Agent.",
      icon: "/Premium features icons/Chat.png",
      gradient: true,
      comingSoon: true,
      path: "/klype-chat",
      isHot: true,
      time: "2 min",
    },
    {
      title: "Convert Voice notes into Posts",
      description: "Transform voice recordings into publish-ready posts",
      icon: "/Premium features icons/Voice Notes.png",
      gradient: true,
      path: "/voice-to-post",
      time: "2 min",
    },
    {
      title: "LinkedIn Profile Generator",
      description: "Upgrade your LinkedIn profile to stand out and get noticed",
      icon: "/Premium features icons/Linkedin.png",
      gradient: true,
      path: "/profile-analyzer",
      isCrown: true,
      time: "4 min",
    },
    {
      title: "Reference-Based Post Cloning",
      description: "Clone and adapt content based on successful references",
      icon: "/Premium features icons/Reference Based.png",
      gradient: true,
      path: "/reference-cloning",
      time: "3 min",
    },
    {
      title: "Full Calendar Automation",
      description: "Automate your entire content calendar workflow",
      icon: "/Premium features icons/Full Calendar.png",
      gradient: true,
      path: "/calendar-automation",
      time: "5 min",
    },
    {
      title: "Inbox Post Delivery",
      description:
        "Automatically send posts to email or inboxes for collaboration",
      icon: "/Premium features icons/Inbox Post.png",
      gradient: true,
      comingSoon: true,
      path: "/inbox-delivery",
      time: "2 min",
    },
    {
      title: "Strategic Goal-Based Content Generator",
      description: "Generate content aligned with your business objectives",
      icon: "/Premium features icons/Strategic Goal.png",
      gradient: true,
      path: "/goal-based-content",
      time: "4 min",
    },
    {
      title: "Notes Sync",
      description: "Sync notes across devices for seamless content creation",
      icon: "/Premium features icons/Notes Sync.png",
      gradient: true,
      path: "/notes-sync",
      time: "3 min",
    },
    {
      title: "Reddit Post Cloning",
      description: "Clone and adapt content from Reddit for LinkedIn",
      icon: "/Premium features icons/Reddit.png",
      gradient: true,
      path: "/reddit-post-cloning",
      time: "3 min",
    },
  ];

  // Filter features based on debounced search query
  const filteredMainFeatures = filterFeatures(
    mainFeatures,
    debouncedSearchQuery
  );
  const filteredPremiumFeatures = filterFeatures(
    premiumFeatures,
    debouncedSearchQuery
  );

  // Check if any features match the search (only when searching)
  const hasResults = debouncedSearchQuery.trim()
    ? filteredMainFeatures.length > 0 || filteredPremiumFeatures.length > 0
    : true;

  return (
    <Layout>
      <Header
        title="Dashboard"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#fc00ff33] to-transparent my-2" />
      {/* Content area with proper padding */}
      <div className="w-full p-7">
        {/* Show search results message if searching */}
        {debouncedSearchQuery.trim() && (
          <div className="text-center mb-6">
            <p className="text-gray-400 text-sm">
              {isSearching ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">🔍</span>
                  Searching...
                </span>
              ) : hasResults ? (
                `Found ${
                  filteredMainFeatures.length + filteredPremiumFeatures.length
                } feature(s) matching "${debouncedSearchQuery}"`
              ) : (
                `No features found matching "${debouncedSearchQuery}"`
              )}
            </p>
          </div>
        )}

        {/* Main features grid */}
        {(filteredMainFeatures.length > 0 || !debouncedSearchQuery.trim()) && (
          <>
            {!debouncedSearchQuery.trim() ? (
              // Show all main features when not searching
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-5 px-[27px]">
                {mainFeatures.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    type="main"
                    title={feature.title}
                    description={feature.description}
                    iconComponent={feature.iconComponent}
                    {...(feature.image ? { image: feature.image } : {})}
                    path={feature.path}
                    isHot={feature.isHot}
                    isCrown={feature.isCrown}
                    time={feature.time}
                  />
                ))}
              </div>
            ) : filteredMainFeatures.length > 0 ? (
              // Show filtered main features when searching
              <>
                <h2 className="text-center text-[#d9d9d9] text-[25px] mb-[20px]">
                  Main Features
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-5 px-[27px]">
                  {filteredMainFeatures.map((feature, index) => (
                    <FeatureCard
                      key={index}
                      type="main"
                      title={feature.title}
                      description={feature.description}
                      iconComponent={feature.iconComponent}
                      {...(feature.image ? { image: feature.image } : {})}
                      path={feature.path}
                      isHot={feature.isHot}
                      isCrown={feature.isCrown}
                      time={feature.time}
                      searchQuery={debouncedSearchQuery}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </>
        )}

        {/* Premium Features Section */}
        {(filteredPremiumFeatures.length > 0 ||
          !debouncedSearchQuery.trim()) && (
          <>
            <h2 className="text-center text-[#d9d9d9] text-[25px] mt-[40px]">
              Premium Features
            </h2>

            {!debouncedSearchQuery.trim() ? (
              // Show all premium features when not searching
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-5 px-[27px] mt-[20px] pb-[40px]">
                {premiumFeatures.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    type="premium"
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    gradient={feature.gradient}
                    comingSoon={feature.comingSoon}
                    path={feature.path}
                    isHot={feature.isHot}
                    isCrown={feature.isCrown}
                    time={feature.time}
                  />
                ))}
              </div>
            ) : filteredPremiumFeatures.length > 0 ? (
              // Show filtered premium features when searching
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-5 px-[27px] mt-[20px] pb-[40px]">
                {filteredPremiumFeatures.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    type="premium"
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    gradient={feature.gradient}
                    comingSoon={feature.comingSoon}
                    path={feature.path}
                    isHot={feature.isHot}
                    isCrown={feature.isCrown}
                    time={feature.time}
                    searchQuery={debouncedSearchQuery}
                  />
                ))}
              </div>
            ) : null}
          </>
        )}

        {/* No results message */}
        {!hasResults && debouncedSearchQuery.trim() && !isSearching && (
          <div className="text-center py-20">
            <div className="text-gray-500 text-xl mb-4">🔍</div>
            <h3 className="text-gray-400 text-lg mb-2">No features found</h3>
            <p className="text-gray-500 text-sm mb-4">
              Try searching with different keywords:
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              {[
                "linkedin",
                "voice",
                "calendar",
                "youtube",
                "viral",
                "chat",
                "clone",
                "reddit",
                "automation",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setSearchQuery(suggestion)}
                  className="px-3 py-1 bg-gray-800 hover:bg-[#fc00ff] text-gray-400 hover:text-white rounded-full transition-colors duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;

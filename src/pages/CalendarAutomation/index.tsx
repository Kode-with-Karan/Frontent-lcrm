import { useState, useEffect } from "react";
import { Calendar, Settings, BarChart3, Plus } from "lucide-react";
import CalendarView from "./components/CalendarView";
import GenerationSetup from "./components/GenerationSetup";
import PostEditor from "./components/PostEditor";
import Analytics from "./components/Analytics";
import UserPreferences from "./components/UserPreferences";
import {
  calendarAPI,
  preferencesAPI,
  Post,
  UserPreferences as UserPrefs,
} from "./services/api";
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import { config } from "../../config/env";

const CalendarAutomation = () => {
  const [activeTab, setActiveTab] = useState<
    "calendar" | "generate" | "analytics" | "preferences"
  >("calendar");
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPrefs | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const userIdRaw = "demo-user";
  const userId = userIdRaw.trim().toLowerCase();

  useEffect(() => {
    console.log("CalendarAutomation component mounted");
    
    // Check if API base URL is configured
    if (!config.apiBaseUrl) {
      console.error("API base URL not configured. Please set VITE_API_BASE_URL in your .env file");
      return;
    }

    // Test API connection
    fetch(`${config.apiBaseUrl}/calendar/posts?userId=${userId}`)
      .then((response) => {
        console.log("API Response status:", response.status);
        if (!response.ok) {
          throw new Error(`API connection failed: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response data:", data.length, "posts");
      })
      .catch((error) => {
        console.error("API Error:", error);
      });

    fetchPosts();
    fetchUserPreferences();
  }, []);
  const refreshPosts = async () => {
    try {
      console.log("Refreshing posts...");
      await fetchPosts();
      console.log("Posts refreshed successfully");
    } catch (error) {
      console.error("Error refreshing posts:", error);
    }
  };
  const fetchPosts = async () => {
    try {
      setLoading(true);
      console.log("Fetching posts for userId:", userId);
      const fetchedPosts = await calendarAPI.getPosts(userId);
      console.log("Posts fetched successfully:", fetchedPosts.length);
      console.log("Raw posts data:", fetchedPosts);
      
      if (fetchedPosts && fetchedPosts.length > 0) {
        console.log(
          "Sample posts:",
          fetchedPosts.slice(0, 2).map((p) => ({
            id: p._id,
            title: p.title,
            scheduledDate: p.scheduledDate,
            theme: p.theme,
          }))
        );
      } else {
        console.log("No posts found or empty array returned");
      }
      
      setPosts(fetchedPosts || []);
      if (fetchedPosts && fetchedPosts.length > 0) {
        console.log('Post scheduledDates:', fetchedPosts.map(p => p.scheduledDate));
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      // Set empty array on error
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };
  const fetchUserPreferences = async () => {
    try {
      if (!config.apiBaseUrl) {
        console.warn("API base URL not configured, using default preferences");
        setUserPreferences({
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
        });
        return;
      }

      const preferences = await preferencesAPI.getPreferences(userId);
      setUserPreferences(preferences);
    } catch (error) {
      console.error("Error fetching preferences:", error);
      // Set default preferences on error
      setUserPreferences({
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
      });
    }
  };
  const handleGeneratePosts = async (config: {
    numberOfPosts: number;
    startDate: string;
    customTopics: string[];
    userInputs: any;
  }) => {
    try {
      setIsGenerating(true);
      console.log("Generating posts with config:", config);

      const result = await calendarAPI.autoGenerate({
        userId,
        customTopics: config.customTopics,
        numberOfPosts: config.numberOfPosts,
        startDate: config.startDate,
        userInputs: config.userInputs,
      });
      console.log('AutoGenerate API result:', result);

      console.log("Generation result:", result);

      if (result.success && result.posts && result.posts.length > 0) {
        console.log(`Successfully generated ${result.posts.length} posts`);
        // Find the last generated post's scheduledDate (if any)
        const lastGeneratedPost = result.posts[result.posts.length - 1];
        // Refresh posts list to include newly generated posts
        await refreshPosts();
        // If post has a scheduledDate, set active tab to calendar and pass date
        if (lastGeneratedPost && lastGeneratedPost.scheduledDate) {
          setActiveTab("calendar");
          // Set the CalendarView's current date to new post's scheduledDate (if supported)
          window.dispatchEvent(new CustomEvent('jumpToCalendarDate', { detail: { date: lastGeneratedPost.scheduledDate } }));
        } else {
          setActiveTab("calendar");
        }
      } else {
        console.error("Failed to generate posts:", result.message);
        alert(`Failed to generate posts: ${result.message}`);
      }
    } catch (error: any) {
      console.error("Error generating posts:", error);
      alert(`Error generating posts: ${error.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };
  const handleUpdatePost = async (postId: string, updates: Partial<Post>) => {
    try {
      await calendarAPI.updatePost(postId, updates);
      await fetchPosts(); // Refresh posts
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await calendarAPI.deletePost(postId);
      await fetchPosts(); // Refresh posts
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleDragPost = async (
    postId: string,
    newDate: Date,
    newTime?: string
  ) => {
    try {
      await calendarAPI.dragPost(postId, newDate, newTime);
      await fetchPosts(); // Refresh posts
    } catch (error) {
      console.error("Error moving post:", error);
      throw error; // Re-throw so CalendarView can handle the error
    }
  };

  const handleBulkOperation = async (
    operation: string,
    postIds: string[],
    data?: any
  ) => {
    try {
      await calendarAPI.bulkOperation(operation, postIds, data);
      await fetchPosts(); // Refresh posts
    } catch (error) {
      console.error("Error in bulk operation:", error);
      throw error;
    }
  };

  const handleUpdatePreferences = async (updates: Partial<UserPrefs>) => {
    try {
      const updatedPreferences = await preferencesAPI.updatePreferences(
        userId,
        updates
      );
      setUserPreferences(updatedPreferences);
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

  const tabs = [
    { id: "calendar", label: "Calendar View", icon: Calendar },
    { id: "generate", label: "Generate Content", icon: Plus },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "preferences", label: "Preferences", icon: Settings },
  ];

  return (
    <Layout>
      {/* Global Header with Back Arrow */}
      <Header
        title="Calendar Automation"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showBackButton
      />
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#fc00ff33] to-transparent my-2" />
      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div
          className="flex space-x-2 border border-white/10 rounded-md p-1 w-fit"
          style={{ background: "rgba(70,70,70,0.25)" }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-2 rounded-md text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 ${
                  isActive
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "text-black" : "text-white"
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "calendar" && (
          <CalendarView
            posts={posts}
            onSelectPost={setSelectedPost}
            onUpdatePost={handleUpdatePost}
            onDeletePost={handleDeletePost}
            onDragPost={handleDragPost}
            onBulkOperation={handleBulkOperation}
            onRefresh={refreshPosts}
            loading={loading}
          />
        )}
        {activeTab === "generate" && (
          <GenerationSetup
            onGenerate={handleGeneratePosts}
            userPreferences={userPreferences}
            isGenerating={isGenerating}
          />
        )}
        {activeTab === "analytics" && <Analytics posts={posts} />}
        {activeTab === "preferences" && userPreferences && (
          <UserPreferences
            preferences={userPreferences}
            onUpdate={handleUpdatePreferences}
          />
        )}
      </div>
      {/* </div> */}

      {/* Post Editor Modal */}
      {selectedPost && (
        <PostEditor
          post={selectedPost}
          onSave={handleUpdatePost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </Layout>
  );
};

export default CalendarAutomation;

import { useState, useEffect } from "react";
import {
  BookOpen,  
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { SiGoogledocs } from "react-icons/si";
import { RiNotionFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import Layout from "../../components/Layout";
import Header from "../../components/Header";
import NotionConnection from "./components/NotionConnection";
import PagesList from "./components/PagesList";
import ContentGenerator from "./components/ContentGenerator";
import GeneratedPostDisplay from "./components/GeneratedPostDisplay";
import PostHistory from "./components/PostHistory";
import GoogleDocsConnection from "./components/GoogleDocsConnection";
import { validateEnvironment } from "../../config/env";
import { notionApi, type Page, type GeneratedPost } from "./services/api";

interface ConnectionStatus {
  notion: boolean;
  googleDocs: boolean;
  appleNotes: boolean;
}

type WorkflowStep =
  | "connect"
  | "select-page"
  | "select-subpage"
  | "generate-post"
  | "complete";

const NotesSync = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "notion" | "google-docs" | "history"
  >("overview");
  const [connections, setConnections] = useState<ConnectionStatus>({
    notion: false,
    googleDocs: false,
    appleNotes: false,
  });
  const [pages, setPages] = useState<Page[]>([]);
  const [subpages, setSubpages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [selectedSubpage, setSelectedSubpage] = useState<Page | null>(null);
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
  const [currentGeneratedPost, setCurrentGeneratedPost] = useState<string>("");
  const [currentWordCount, setCurrentWordCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("connect");
  const [userId] = useState(() => {
    // Generate a unique user ID for this session
    const stored = localStorage.getItem("klype_user_id");
    if (stored) {
      return stored;
    }
    const newId = `user_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    localStorage.setItem("klype_user_id", newId);
    return newId;
  });
  const [envConfigValid, setEnvConfigValid] = useState(true);
  const [backendStatus, setBackendStatus] = useState<
    "checking" | "connected" | "disconnected"
  >("checking");
  const [searchQuery, setSearchQuery] = useState("");

  // Effect to update workflow step based on state
  useEffect(() => {
    if (!connections.notion) {
      setCurrentStep("connect");
    } else if (!selectedPage) {
      setCurrentStep("select-page");
    } else if (subpages.length > 0 && !selectedSubpage) {
      setCurrentStep("select-subpage");
    } else {
      setCurrentStep("generate-post");
    }
  }, [connections.notion, selectedPage, selectedSubpage, subpages.length]);

  // Listen for OAuth completion messages from popup
  useEffect(() => {
    const handleOAuthMessage = async (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === "NOTION_OAUTH_SUCCESS") {
        console.log("OAuth success message received:", event.data);
        // Refresh connection status after successful OAuth
        setIsLoading(true);
        try {
          await checkConnectionStatus();
          setConnections((prev) => ({ ...prev, notion: true }));
          console.log("Connection status refreshed after OAuth");
        } catch (error) {
          console.error("Failed to refresh connection status:", error);
        } finally {
          setIsLoading(false);
        }
      } else if (event.data.type === "NOTION_OAUTH_ERROR") {
        console.error("OAuth error message received:", event.data);
        alert(`OAuth failed: ${event.data.error}`);
        setIsLoading(false);
      }
    };

    window.addEventListener("message", handleOAuthMessage);
    return () => window.removeEventListener("message", handleOAuthMessage);
  }, []);

  // Validate environment configuration on mount
  useEffect(() => {
    const isValid = validateEnvironment();
    setEnvConfigValid(isValid);
  }, []); // Check connection status on mount
  useEffect(() => {
    checkConnectionStatus();
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      await notionApi.testConnection();
      setBackendStatus("connected");
    } catch (error) {
      console.error("Backend connection failed:", error);
      setBackendStatus("disconnected");
    }
  };
  const checkConnectionStatus = async () => {
    try {
      console.log("Checking connection status for userId:", userId);
      // Check if user has notion connection by trying to get pages
      const response = await notionApi.getPages(userId);
      console.log("getPages response:", response);
      if (response.pages && response.pages.length > 0) {
        setConnections((prev) => ({ ...prev, notion: true }));
        setPages(response.pages);
        console.log(`Found ${response.pages.length} pages`);
      } else {
        console.log("No pages found, connection might not be established");
        setConnections((prev) => ({ ...prev, notion: false }));
        setPages([]);
      }
    } catch (error) {
      console.log("No notion connection found:", error);
      setConnections((prev) => ({ ...prev, notion: false }));
      setPages([]);
    }
  };
  const handleNotionConnect = async () => {
    try {
      setIsLoading(true);
      // This will open Notion OAuth in a popup
      const response = await notionApi.initiateConnection(userId);
      if (response.success) {
        setConnections((prev) => ({ ...prev, notion: true }));
        await checkConnectionStatus();
      }
    } catch (error) {
      console.error("Failed to connect Notion:", error);
      // Show error to user
      alert(
        `Failed to connect Notion: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handlePageSelect = async (page: Page) => {
    try {
      setSelectedPage(page);
      setSelectedSubpage(null); // Reset subpage selection
      setIsLoading(true);

      // Check if this page has subpages
      const subpagesResponse = await notionApi.getSubpages(userId, page.id);
      setSubpages(subpagesResponse.pages);

      // If no subpages, we can proceed directly to generation
      if (subpagesResponse.pages.length === 0) {
        setActiveTab("notion");
      }
    } catch (error) {
      console.error("Failed to fetch subpages:", error);
      setSubpages([]); // Continue without subpages
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubpageSelect = (subpage: Page) => {
    setSelectedSubpage(subpage);
    setActiveTab("notion");
  };
  const handlePostGenerated = (post: GeneratedPost) => {
    setGeneratedPosts((prev) => [post, ...prev]);
  };

  const handleGeneratedPostUpdate = (post: string, wordCount: number) => {
    setCurrentGeneratedPost(post);
    setCurrentWordCount(wordCount);
  };
  const connectionCount = Object.values(connections).filter(Boolean).length;
  const getStepStatus = (step: WorkflowStep) => {
    const stepOrder: WorkflowStep[] = [
      "connect",
      "select-page",
      "select-subpage",
      "generate-post",
      "complete",
    ];
    const currentStepIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step);

    if (stepIndex < currentStepIndex) return "completed";
    if (stepIndex === currentStepIndex) return "current";
    return "upcoming";
  };

  const getStepLabel = (step: WorkflowStep) => {
    switch (step) {
      case "connect":
        return "Connect Notion";
      case "select-page":
        return "Select Page";
      case "select-subpage":
        return "Select Subpage (Optional)";
      case "generate-post":
        return "Generate Post";
      case "complete":
        return "Complete";
      default:
        return "";
    }
  };

  const renderWorkflowStepper = () => {
    const steps: WorkflowStep[] = [
      "connect",
      "select-page",
      "select-subpage",
      "generate-post",
    ];

    return (
      <div
        className="rounded-md p-6 mb-6 border border-[#333333]"
        style={{ background: "rgba(70, 70, 70, 0.25)" }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">
          Notion to LinkedIn Post Workflow
        </h3>
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(step);
            const isLast = index === steps.length - 1;

            return (
              <div key={step} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      status === "completed"
                        ? "bg-[#00dbde] text-white"
                        : status === "current"
                        ? "bg-[#fc00ff] text-white"
                        : "bg-gray-600 text-gray-300"
                    }`}
                  >
                    {status === "completed" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      status === "completed" || status === "current"
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                  >
                    {getStepLabel(step)}
                  </span>
                </div>

                {!isLast && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      status === "completed" ? "bg-[#00dbde]" : "bg-gray-600"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <Header
        title="Notes Sync"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showBackButton
      />
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#fc00ff33] to-transparent my-2" />
      <div className="w-full p-7 text-xs">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Environment Configuration Warning */}
          {!envConfigValid && (
            <div
              className="border border-[#fc00ff33] rounded-md p-4 mb-6"
              style={{ background: "rgba(252, 0, 255, 0.05)" }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-[#fc00ff]" />
                <span className="text-[#fc00ff] font-medium">
                  Configuration Required
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Notion integration requires configuration. Please set up your
                environment variables in your .env file:
              </p>
              <div
                className="rounded p-3 text-xs text-gray-200 font-mono"
                style={{ background: "rgba(252, 0, 255, 0.1)" }}
              >
                <div>
                  VITE_NOTION_CLIENT_ID=206d872b-594c-809a-9ef4-003748aa7b01
                </div>
                <div>
                  VITE_NOTION_REDIRECT_URI=https://dashboard.klype.io/notion-callback
                </div>
                <div>VITE_API_BASE_URL=http://localhost:3002/api</div>
              </div>
              <p className="text-gray-300 text-xs mt-2">
                Make sure your backend is running on port 3002 and has the
                matching environment configuration.
              </p>
            </div>
          )}
          {/* Backend Status Warning */}
          {backendStatus === "disconnected" && (
            <div
              className="border border-[#ff5fa2] rounded-md p-4 mb-6"
              style={{ background: "rgba(255, 95, 162, 0.05)" }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-[#ff5fa2]" />
                <span className="text-[#ff5fa2] font-medium">
                  Backend Connection Failed
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Cannot connect to the backend server. Please ensure:
              </p>
              <ul className="text-gray-300 text-sm space-y-1 mb-3">
                <li>• Backend server is running on port 3002</li>
                <li>• Database is running and accessible</li>
                <li>• All environment variables are properly configured</li>
              </ul>
              <button
                onClick={checkBackendStatus}
                className="px-3 py-1 rounded-md bg-white text-black border border-[#fc00ff] shadow hover:bg-[#fc00ff] hover:text-white transition-all text-xs font-medium"
              >
                Retry Connection
              </button>
            </div>
          )}
          {/* Connection Status */}
          <div
            className="rounded-md p-4 mb-6 border border-[#333333]"
            style={{ background: "rgba(70, 70, 70, 0.25)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Connected Apps ({connectionCount}/3)
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={checkConnectionStatus}
                  disabled={isLoading}
                  className={`px-3 py-1 rounded-md border text-xs font-medium transition-all shadow ${
                    isLoading
                      ? "bg-rgba(70, 70, 70, 0.25) text-white"
                      : "bg-rgba(70, 70, 70, 0.25) text-white border-[#333333] hover:bg-white hover:text-black"
                  }`}
                >
                  {isLoading ? "Refreshing..." : "Refresh"}
                </button>
                {connections.notion && (
                  <div className="flex items-center space-x-1 bg-[#00dbde] px-2 py-1 rounded text-xs">
                    <CheckCircle className="w-3 h-3" />
                    <span>Notion</span>
                  </div>
                )}
                {connections.googleDocs && (
                  <div className="flex items-center space-x-1 bg-[#6c47ff] px-2 py-1 rounded text-xs">
                    <CheckCircle className="w-3 h-3" />
                    <span>Google Docs</span>
                  </div>
                )}
                {connections.appleNotes && (
                  <div className="flex items-center space-x-1 bg-gray-600 px-2 py-1 rounded text-xs">
                    <CheckCircle className="w-3 h-3" />
                    <span>Apple Notes</span>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full bg-gray-600 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#fc00ff] to-[#00dbde] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(connectionCount / 3) * 100}%` }}
              ></div>
            </div>
          </div>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div
              className="rounded-md p-4 border border-[#333333] flex flex-col items-center justify-center"
              style={{ background: "rgba(70, 70, 70, 0.25)" }}
            >
              <p className="text-gray-400 text-sm text-center mb-1 font-semibold">
                Pages
              </p>
              <p className="text-2xl font-bold text-white text-center">
                {pages.length}
              </p>
            </div>

            <div
              className="rounded-md p-4 border border-[#333333] flex flex-col items-center justify-center"
              style={{ background: "rgba(70, 70, 70, 0.25)" }}
            >
              <p className="text-gray-400 text-sm text-center mb-1 font-semibold">
                Generated Posts
              </p>
              <p className="text-2xl font-bold text-white text-center">
                {generatedPosts.length}
              </p>
            </div>

            <div
              className="rounded-md p-4 border border-[#333333] flex flex-col items-center justify-center"
              style={{ background: "rgba(70, 70, 70, 0.25)" }}
            >
              <p className="text-gray-400 text-sm text-center mb-1 font-semibold">
                Scheduled
              </p>
              <p className="text-2xl font-bold text-white text-center">
                {generatedPosts.filter((p) => p.isScheduled).length}
              </p>
            </div>

            <div
              className="rounded-md p-4 border border-[#333333] flex flex-col items-center justify-center"
              style={{ background: "rgba(70, 70, 70, 0.25)" }}
            >
              <p className="text-gray-400 text-sm text-center mb-1 font-semibold">
                Connections
              </p>
              <p className="text-2xl font-bold text-white text-center">
                {connectionCount}
              </p>
            </div>
          </div>

          {(() => {
            const navTabs = [
              {
                id: "overview",
                label: "Overview",
                icon: () => (
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1665/1665652.png"
                    alt="Overview"
                    className="w-4 h-4"
                    style={{ display: "inline-block" }}
                  />
                ),
              },
              {
                id: "notion",
                label: "Notion",
                icon: RiNotionFill,
              },
              {
                id: "google-docs",
                label: "Google Docs",
                icon: SiGoogledocs,
              },
              { id: "history", label: "Generated Posts", icon: FaPlus },
            ];
            return (
              <div
                className="rounded-md p-1 border border-[#333333]"
                style={{ background: "rgba(70, 70, 70, 0.25)" }}
              >
                <div className="flex w-full rounded-md overflow-x-auto space-x-2">
                  {navTabs.map((tab, idx, arr) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center justify-center space-x-2 px-4 py-2 font-medium transition-all border text-xs shadow ${
                        activeTab === tab.id
                          ? "bg-white text-black border-[#fc00ff]"
                          : "bg-transparent text-white border-transparent hover:bg-white/10 hover:text-black"
                      } ${idx === 0 ? "rounded-l-md" : ""} ${
                        idx === arr.length - 1 ? "rounded-r-md" : ""
                      }`}
                      style={{ flex: 1, minWidth: 0 }}
                    >
                      {typeof tab.icon === "function" ? (
                        tab.icon.length === 0 ? (
                          tab.icon({})
                        ) : (
                          <tab.icon className="w-4 h-4" />
                        )
                      ) : null}
                      <span className="truncate">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Content Area */}
          <div className="space-y-6">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Connection Cards */}{" "}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Connect Your Apps
                  </h3>{" "}
                  <NotionConnection
                    isConnected={connections.notion}
                    onConnect={handleNotionConnect}
                    isLoading={isLoading}
                    pages={pages}
                    envConfigValid={envConfigValid}
                  />
                  <GoogleDocsConnection
                    isConnected={connections.googleDocs}
                    onConnect={() => {
                      /* TODO: Implement Google Docs connection */
                    }}
                  />
                  <div
                    className="rounded-md p-6 border border-[#333333]"
                    style={{ background: "rgba(70, 70, 70, 0.25)" }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gray-600 rounded-lg">
                          <BookOpen className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">
                            Apple Notes
                          </h4>
                          <p className="text-gray-400">Coming Soon</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-gray-700 rounded text-gray-400 text-sm">
                        Coming Soon
                      </div>
                    </div>
                  </div>
                </div>
                {/* Recent Activity */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Recent Activity
                  </h3>
                  <div
                    className="rounded-md p-6 space-y-4 border border-[#333333]"
                    style={{ background: "rgba(70, 70, 70, 0.25)" }}
                  >
                    {generatedPosts.length === 0 ? (
                      <div className="text-center py-8">
                        <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No posts generated yet</p>
                        <p className="text-gray-500 text-sm">
                          Connect an app and start generating content
                        </p>
                      </div>
                    ) : (
                      generatedPosts.slice(0, 5).map((post) => (
                        <div
                          key={post.id}
                          className="border-l-4 border-[#fc00ff] pl-4"
                        >
                          <p className="text-white font-medium truncate">
                            {post.content.substring(0, 60)}...{" "}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {post.sourceType} •{" "}
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notion" && (
              <div className="space-y-6">
                {renderWorkflowStepper()} {/* Step 1: Connect Notion */}
                {currentStep === "connect" && (
                  <div className="grid grid-cols-1 gap-6">
                    {" "}
                    <NotionConnection
                      isConnected={connections.notion}
                      onConnect={handleNotionConnect}
                      isLoading={isLoading}
                      pages={pages}
                      envConfigValid={envConfigValid}
                    />
                  </div>
                )}
                {/* Step 2: Select Page */}
                {currentStep === "select-page" && (
                  <div className="grid grid-cols-1 gap-6">
                    <PagesList
                      pages={pages}
                      selectedPage={selectedPage}
                      onPageSelect={handlePageSelect}
                      isLoading={isLoading}
                    />
                  </div>
                )}
                {/* Step 3: Select Subpage (Optional) */}
                {currentStep === "select-subpage" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <PagesList
                        pages={pages}
                        selectedPage={selectedPage}
                        onPageSelect={handlePageSelect}
                        isLoading={isLoading}
                        disabled={true}
                      />
                    </div>
                    <div>
                      <PagesList
                        pages={subpages}
                        selectedPage={selectedSubpage}
                        onPageSelect={handleSubpageSelect}
                        isLoading={isLoading}
                        title="Select Subpage (Optional)"
                        subtitle={`Found ${subpages.length} subpage${
                          subpages.length !== 1 ? "s" : ""
                        } under "${selectedPage?.title}"`}
                        emptyMessage="No subpages found. You can proceed to generate a post from the main page."
                        allowSkip={true}
                        onSkip={() => setCurrentStep("generate-post")}
                      />
                    </div>
                  </div>
                )}{" "}
                {/* Step 4: Generate Post */}
                {currentStep === "generate-post" && (
                  <div className="space-y-6">
                    {/* Page Selection Row */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                      <div className="xl:col-span-1">
                        <PagesList
                          pages={pages}
                          selectedPage={selectedPage}
                          onPageSelect={handlePageSelect}
                          isLoading={isLoading}
                          disabled={true}
                        />
                      </div>

                      {subpages.length > 0 && (
                        <div className="xl:col-span-1">
                          <PagesList
                            pages={subpages}
                            selectedPage={selectedSubpage}
                            onPageSelect={handleSubpageSelect}
                            isLoading={isLoading}
                            disabled={true}
                          />
                        </div>
                      )}
                    </div>

                    {/* Content Generation Row */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      <div>
                        <ContentGenerator
                          selectedPage={selectedSubpage || selectedPage}
                          userId={userId}
                          onPostGenerated={handlePostGenerated}
                          onGeneratedPostUpdate={handleGeneratedPostUpdate}
                        />
                      </div>
                      <div>
                        <GeneratedPostDisplay
                          generatedPost={currentGeneratedPost}
                          wordCount={currentWordCount}
                          onCopy={() => console.log("Post copied")}
                          onDownload={() => console.log("Post downloaded")}
                          onSchedule={() => console.log("Post scheduled")}
                          onPublish={() => console.log("Post published")}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "google-docs" && (
              <div
                className="rounded-md p-8 text-center border border-[#333333]"
                style={{ background: "rgba(70, 70, 70, 0.25)" }}
              >
                <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Google Docs Integration
                </h3>
                <p className="text-gray-400 mb-6">
                  Coming Soon - Connect your Google Docs to transform documents
                  into LinkedIn posts
                </p>
                <button
                  disabled
                  className="bg-gray-700 text-gray-500 px-6 py-3 rounded-lg cursor-not-allowed"
                >
                  Connect Google Docs
                </button>
              </div>
            )}

            {activeTab === "history" && (
              <PostHistory
                posts={generatedPosts}
                onPostUpdate={(updatedPost: GeneratedPost) => {
                  setGeneratedPosts((prev) =>
                    prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
                  );
                }}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotesSync;

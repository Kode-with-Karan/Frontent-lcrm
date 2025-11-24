import { useState, useEffect } from "react";
import {
  CheckCircle,
  ExternalLink,
  Loader2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { RiNotionFill } from "react-icons/ri";
import type { Page } from "../services/api";

interface NotionConnectionProps {
  isConnected: boolean;
  onConnectSuccess: () => void;
  isLoading: boolean;
  pages: Page[];
  envConfigValid?: boolean;
}

const NotionConnection = ({
  isConnected,
  onConnectSuccess,
  isLoading,
  pages,
  envConfigValid = true,
}: NotionConnectionProps) => {
  const [showPages, setShowPages] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    // Listen for messages from popup
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "NOTION_OAUTH_SUCCESS") {
        setConnecting(false);
        onConnectSuccess();
      }

      if (event.data.type === "NOTION_OAUTH_ERROR") {
        setConnecting(false);
        alert(`Notion connection failed: ${event.data.error}`);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onConnectSuccess]);

  const handleConnect = () => {
    if (!envConfigValid) return;
    setConnecting(true);

    const userId = localStorage.getItem("userId"); // Or fetch from your auth context
    const popup = window.open(
      `${process.env.REACT_APP_API_BASE_URL}/notion/auth?userId=${userId}`,
      "notion_oauth",
      "width=600,height=800"
    );

    const timer = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(timer);
        setConnecting(false);
      }
    }, 500);
  };

  return (
    <div className="rounded-xl p-8 border border-[#333333]" style={{ background: "rgba(70, 70, 70, 0.25)" }}>
      {!isConnected ? (
        <div className="text-center">
          <div className="p-1 mb-2 flex items-center justify-center">
            <RiNotionFill className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">
            Connect Your Notion Workspace
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Connect your Notion account to access your pages and notes. We will help you transform your content into engaging LinkedIn posts.
          </p>

          {!envConfigValid && (
            <div className="border border-[#fc00ff33] rounded-xl p-4 mb-6 max-w-md mx-auto" style={{ background: "rgba(252, 0, 255, 0.05)" }}>
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-[#fc00ff]" />
                <span className="text-[#fc00ff] font-medium">Configuration Required</span>
              </div>
              <p className="text-gray-300 text-sm">
                Please ensure your environment variables are configured correctly.
              </p>
            </div>
          )}

          <button
            onClick={handleConnect}
            disabled={connecting || !envConfigValid}
            className={`px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
              connecting || !envConfigValid
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#fc00ff] to-[#00dbde] hover:from-[#ff5fa2] hover:to-[#6c47ff] text-white shadow-lg"
            }`}
          >
            {connecting ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Connecting...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <RiNotionFill className="w-5 h-5" />
                <span>Connect Notion</span>
              </div>
            )}
          </button>

          <p className="text-gray-500 text-sm mt-4">
            We will open a secure popup to authenticate with Notion
          </p>
        </div>
      ) : (
        <div className="text-center">
          <div className="p-4 bg-gradient-to-r from-[#00dbde] to-[#fc00ff] rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">
            Notion Connected Successfully!
          </h3>
          <p className="text-gray-400 mb-6">
            Found {pages.length} page{pages.length !== 1 ? "s" : ""} in your workspace.
          </p>

          <div className="flex items-center justify-center space-x-6 mb-6">
            <div className="flex items-center space-x-2 text-[#00dbde]">
              <CheckCircle className="w-5 h-5" />
              <span>Connected to Notion</span>
            </div>
            <div className="flex items-center space-x-2 text-[#fc00ff]">
              <FileText className="w-5 h-5" />
              <span>{pages.length} pages</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setShowPages(!showPages)}
              className="px-4 py-2 bg-[#6c47ff] hover:bg-[#a259ff] text-white rounded-lg text-sm transition-colors"
            >
              {showPages ? "Hide" : "View"} Pages
            </button>
          </div>

          {showPages && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h5 className="text-white font-medium mb-4">
                Available Pages ({pages.length})
              </h5>
              {pages.length === 0 ? (
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">No Pages Found</span>
                  </div>
                  <p className="text-yellow-300 text-sm">
                    No pages were found in your Notion workspace. Make sure you have pages with content to convert.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {pages.map((page) => (
                    <div key={page.id} className="bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <div>
                            <p className="text-white font-medium text-sm">
                              {typeof page.title === "string" ? page.title : "Untitled Page"}
                            </p>
                            <p className="text-gray-400 text-xs">
                              Last edited: {new Date(page.last_edited_time).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {page.url && typeof page.url === "string" && (
                          <a
                            href={page.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-400 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotionConnection;

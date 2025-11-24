import { useState } from "react";
import {
  CheckCircle,
  // ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { SiGoogledocs } from "react-icons/si";

interface GoogleDocsConnectionProps {
  isConnected: boolean;
  onConnect: () => void;
}

const GoogleDocsConnection = ({
  isConnected,
  onConnect,
}: GoogleDocsConnectionProps) => {
  const [isLoading] = useState(false);

  return (
    <div
      className="rounded-xl p-6 border border-[#333333]"
      style={{ background: "rgba(70, 70, 70, 0.25)" }}
    >
      
      <div className="flex items-center justify-between mb-4">        
        <div className="flex items-center space-x-4">
          <SiGoogledocs className="w-10 h-10" />
          <div>
            <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
              <span>Google Docs</span>
              {isConnected && (
                <CheckCircle className="w-5 h-5 text-[#00dbde]" />
              )}
            </h4>
            <p className="text-gray-400">
              {isConnected
                ? "Connected to Google Docs"
                : "Transform Google Docs into LinkedIn posts"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isConnected ? (
            <div className="px-3 py-2 bg-[#00dbde] rounded-lg text-white text-sm flex items-center space-x-1">
              <CheckCircle className="w-4 h-4" />
              <span>Connected</span>
            </div>
          ) : (
            <button
              onClick={onConnect}
              disabled={isLoading}
              className="px-3 py-1 bg-gray-700 rounded text-gray-400 text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  {/* <ExternalLink className="w-4 h-4" /> */}
                  <span>Coming Soon</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {!isConnected && (
        <div className="space-y-4">
          <div
            className="border border-[#6c47ff33] rounded-xl p-4"
            style={{ background: "rgba(108, 71, 255, 0.05)" }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-5 h-5 text-[#6c47ff]" />
              <span className="text-[#6c47ff] font-medium">Coming Soon</span>
            </div>
            <p className="text-gray-300 text-sm">
              Google Docs integration is currently in development. Once
              available, you'll be able to:
            </p>
          </div>

          <div className="text-sm text-gray-400">
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>Import documents directly from Google Drive</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>Convert drafts and outlines to LinkedIn posts</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>Maintain formatting and structure</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>Real-time synchronization</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {isConnected && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-medium">
              Successfully Connected
            </span>
          </div>
          <p className="text-green-300 text-sm">
            Your Google Docs account is connected. You can now import documents
            and convert them to LinkedIn posts.
          </p>
        </div>
      )}
    </div>
  );
};

export default GoogleDocsConnection;

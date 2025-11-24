import { useState } from "react";
import { Copy, Download, Calendar, Zap, CheckCircle } from "lucide-react";

interface GeneratedPostDisplayProps {
  generatedPost: string;
  wordCount: number;
  onCopy?: () => void;
  onDownload?: () => void;
  onSchedule?: () => void;
  onPublish?: () => void;
}

const GeneratedPostDisplay = ({
  generatedPost,
  wordCount,
  onCopy,
  onDownload,
  onSchedule,
  onPublish,
}: GeneratedPostDisplayProps) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      onCopy?.();
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const downloadAsText = (text: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    onDownload?.();
  };

  if (!generatedPost) {
    return (
      <div
        className="rounded-xl p-6 border border-[#333333]"
        style={{ background: "rgba(70, 70, 70, 0.25)" }}
      >
        <h3 className="text-xl font-semibold text-white mb-4">
          Generated Post
        </h3>
        <div
          className="rounded-xl p-6 min-h-[400px] flex items-center justify-center border border-[#333333]"
          style={{ background: "rgba(70, 70, 70, 0.15)" }}
        >
          <div className="text-center">
            <Zap className="w-12 h-12 text-[#a259ff] mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No post generated yet</p>
            <p className="text-gray-500 text-sm">
              Configure your settings and click "Generate LinkedIn Post" to see
              your content here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-6 border border-[#333333]"
      style={{ background: "rgba(70, 70, 70, 0.25)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">Generated Post</h3>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-sm">{wordCount} words</span>
          <button
            onClick={() => copyToClipboard(generatedPost)}
            className="text-[#a259ff] hover:text-[#fc00ff] p-2 rounded transition-colors"
            title="Copy to clipboard"
          >
            {copySuccess ? (
              <CheckCircle className="w-4 h-4 text-[#00dbde]" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => downloadAsText(generatedPost, "linkedin-post.txt")}
            className="text-[#a259ff] hover:text-[#fc00ff] p-2 rounded transition-colors"
            title="Download as text"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        className="rounded-xl p-4 mb-4 min-h-[300px] border border-[#333333]"
        style={{ background: "rgba(70, 70, 70, 0.15)" }}
      >
        <pre className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">
          {generatedPost}
        </pre>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onSchedule}
          className="flex-1 bg-gradient-to-r from-[#6c47ff] to-[#a259ff] hover:from-[#fc00ff] hover:to-[#00dbde] text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <Calendar className="w-4 h-4" />
          <span>Schedule Post</span>
        </button>
        <button
          onClick={onPublish}
          className="flex-1 bg-gradient-to-r from-[#00dbde] to-[#fc00ff] hover:from-[#fc00ff] hover:to-[#00dbde] text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Publish Now
        </button>
      </div>

      {copySuccess && (
        <div className="mt-3 flex items-center space-x-2 text-[#00dbde] text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>Copied to clipboard!</span>
        </div>
      )}
    </div>
  );
};

export default GeneratedPostDisplay;

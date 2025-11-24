import { useState, useEffect } from "react";
import { Loader2, Zap, Eye, AlertCircle, CheckCircle } from "lucide-react";
import type { Page, GeneratedPost } from "../services/api";
import { notionApi } from "../services/api";

interface ContentGeneratorProps {
  selectedPage: Page | null;
  userId: string;
  onPostGenerated: (post: GeneratedPost) => void;
  onGeneratedPostUpdate: (post: string, wordCount: number) => void;
}

const ContentGenerator = ({
  selectedPage,
  userId,
  onPostGenerated,
  onGeneratedPostUpdate,
}: ContentGeneratorProps) => {
  const [content, setContent] = useState<string>("");
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState<string>("storytelling");
  const [goal, setGoal] = useState<string>("engagement");
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const toneOptions = [
    {
      value: "storytelling",
      label: "Storytelling",
      description: "Narrative with personal anecdotes",
    },
    {
      value: "educational",
      label: "Educational",
      description: "Teaching valuable insights",
    },
    {
      value: "inspirational",
      label: "Inspirational",
      description: "Motivating and uplifting",
    },
    {
      value: "professional",
      label: "Professional",
      description: "Business-focused and authoritative",
    },
    {
      value: "conversational",
      label: "Conversational",
      description: "Friendly and approachable",
    },
  ];

  const goalOptions = [
    {
      value: "engagement",
      label: "Engagement",
      description: "Maximize likes, comments, shares",
    },
    {
      value: "leads",
      label: "Lead Generation",
      description: "Generate business inquiries",
    },
    {
      value: "authority",
      label: "Authority Building",
      description: "Establish industry expertise",
    },
    {
      value: "network",
      label: "Networking",
      description: "Encourage professional connections",
    },
  ];

  useEffect(() => {
    if (selectedPage) {
      loadPageContent();
    }
  }, [selectedPage]);

  const loadPageContent = async () => {
    if (!selectedPage) return;

    setIsLoadingContent(true);
    setError("");
    try {
      console.log("Loading content for page:", selectedPage.id);
      const response = await notionApi.getPageContent(userId, selectedPage.id);
      setContent(response.content);
      console.log("Content loaded successfully");
    } catch (error) {
      console.error("Error loading content:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load content"
      );
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedPage || !content.trim()) {
      setError("No content available to generate post from");
      return;
    }

    setIsGenerating(true);
    setError("");
    setSuccess("");

    try {
      const response = await notionApi.generatePost(
        userId,
        content,
        tone,
        goal
      );

      if (response.success) {
        // Update the parent component with the generated post
        onGeneratedPostUpdate(response.generatedPost, response.wordCount);

        // Create post object for history
        const newPost: GeneratedPost = {
          id: Date.now().toString(),
          content: response.generatedPost,
          sourceType: "notion",
          sourceId: selectedPage?.id,
          tone,
          createdAt: new Date().toISOString(),
          isScheduled: false,
          originalContent: response.originalContent,
          wordCount: response.wordCount,
        };

        onPostGenerated(newPost);
        setSuccess("Post generated successfully!");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to generate post"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  if (!selectedPage) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="text-center py-8">
          <Zap className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Select a page to generate content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
        <Zap className="w-5 h-5" />
        <span>Content Generator</span>
      </h3>

      <div className="space-y-6">
        {/* Selected Page Info */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2">Selected Page</h4>
          <p className="text-gray-300 text-sm">
            {selectedPage.title || "Untitled Page"}
          </p>
          <p className="text-gray-500 text-xs">
            Last edited:{" "}
            {new Date(selectedPage.last_edited_time).toLocaleDateString()}
          </p>
        </div>

        {/* Content Preview */}
        {isLoadingContent ? (
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-white">Loading content...</span>
            </div>
          </div>
        ) : content ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-medium">Content Preview</h4>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-purple-400 hover:text-purple-300 text-sm flex items-center space-x-1"
              >
                <Eye className="w-4 h-4" />
                <span>{showPreview ? "Hide" : "Show"}</span>
              </button>
            </div>

            {showPreview && (
              <div className="bg-gray-700 rounded-lg p-4 max-h-32 overflow-y-auto">
                <pre className="text-gray-300 text-sm whitespace-pre-wrap">
                  {content}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400">
                No content found in this page
              </span>
            </div>
          </div>
        )}

        {/* Generation Settings */}
        <div className="space-y-4">
          <h4 className="text-white font-medium">Generation Settings</h4>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {toneOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} - {option.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {goalOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} - {option.description}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !content.trim()}
          className={`btn w-full transition-colors flex items-center justify-center space-x-2 rounded-lg font-medium py-3 px-4 text-white${
            !isGenerating && content.trim() ? " btn--default" : ""
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Generate LinkedIn Post</span>
            </>
          )}
        </button>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400">{success}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentGenerator;

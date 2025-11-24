import React, { useState } from "react";
import Header from "../components/Header";
import Layout from "../components/Layout";
import { Copy, Pencil } from "lucide-react";

const CreatePost = () => {
  const [prompt, setPrompt] = useState("");
  const [tags, setTags] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTags(e.target.value);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      if (!import.meta.env.VITE_API_BASE_URL) {
        throw new Error("API base URL missing. Set VITE_API_BASE_URL in your .env");
      }

      // Debug: Log the URL being called
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/post/test-generate`;
      console.log("Calling API URL:", apiUrl);
      
      // Use the test endpoint for CreatePost (no auth required)
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          textInput: tags.trim() ? `${prompt}\n\nTags: ${tags}` : prompt,
          role: "Founders",
          intent: "Story",
        }),
      });
      const data = await response.json();
      if (response.ok && data.success && data.post) {
        setSuccess("✅ Post generated: " + data.post.content);
        setPrompt("");
        setTags("");
      } else {
        setError(data.error || data.message || "Failed to generate post.");
      }
    } catch (err: any) {
      console.error("Network error:", err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError("Cannot connect to server. Please check if the backend is running on port 3002.");
      } else {
        setError(err.message || "Failed to generate post. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Header
        title="Create a Post"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showBackButton
      />
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#fc00ff33] to-transparent my-2" />
      <div className="pt-4 w-full flex flex-col items-center">
        <form onSubmit={handleCreatePost} className="w-full max-w-2xl mt-8">
          <textarea
            className="w-full h-48 p-4 mb-6 rounded-lg text-white border border-[#4b004b] focus:outline-none focus:ring-2 focus:ring-purple-700 text-base"
            style={{ backgroundColor: "rgba(70,70,70,0.25)" }}
            placeholder="Type your prompt here.."
            value={prompt}
            onChange={handlePromptChange}
          />
          <textarea
            className="w-full h-20 p-4 mb-6 rounded-lg text-white border border-[#4b004b] focus:outline-none focus:ring-2 focus:ring-purple-700 text-base"
            style={{ backgroundColor: "rgba(70,70,70,0.25)" }}
            placeholder="LLM, Deep learning, Neural networks"
            value={tags}
            onChange={handleTagsChange}
          />
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn--default bg-black text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-[#2d002e] border border-[#4b004b] transition flex items-center"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                  Creating...
                </>
              ) : (
                "Create Post"
              )}
            </button>
          </div>
          {/* Show generated post below the button */}
          {success && (
            <div className="mt-6 flex flex-col items-center mb-10">
              <div
                className="w-full max-w-3xl p-6 relative rounded-md"
                style={{ background: "rgba(70,70,70,0.25)" }}
              >
                <div className="font-semibold mb-2 text-base text-center flex items-center justify-center text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-[#a259ff]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Post Generated
                </div>
                <div
                  className="whitespace-pre-line mb-4 text-base text-white"
                  id="generated-post-content"
                >
                  {success.replace(/^✅ Post generated: /, "")}
                </div>
                {/* Action buttons outside the box */}
              </div>
              <div className="flex gap-4 justify-center mt-4">
                <button
                  type="button"
                  className="bg-white hover:bg-gray-200 text-black flex items-center justify-center shadow px-4 py-2 rounded"
                  title="Copy"
                  onClick={() => {
                    const text = success.replace(/^✅ Post generated: /, "");
                    navigator.clipboard.writeText(text);
                  }}
                >
                  <Copy className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black flex items-center justify-center shadow px-4 py-2 rounded"
                  title="Edit"
                  onClick={() => {
                    setPrompt(success.replace(/^✅ Post generated: /, ""));
                    setSuccess(null);
                  }}
                >
                  <Pencil className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
          {error && <p className="text-[#ff5fa2] mt-4 mb-4">{error}</p>}
        </form>
      </div>
    </Layout>
  );
};

export default CreatePost;

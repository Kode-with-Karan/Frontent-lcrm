import React from "react";
import { useState } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import { Search, TrendingUp, Heart, Share, ClipboardCopy } from "lucide-react";

const ViralPostSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<ViralPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      if (!import.meta.env.VITE_API_BASE_URL) {
        throw new Error("API base URL missing. Set VITE_API_BASE_URL in your .env");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/viralpost/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ keyword: searchTerm.trim() }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success && data.posts && data.posts.length > 0) {
        setResults(data.posts);
      } else {
        setResults([]);
        setError(data.error || "No viral posts found for this topic.");
      }
    } catch (err: any) {
      console.error("Error fetching posts:", err);
      setError(err.message || "Failed to search viral posts.");
    } finally {
      setIsSearching(false);
    }
  };

  interface Engagement {
    likes: number;
    comments: number;
    shares: number;
  }

  interface ViralPost {
    tone: string;
    text: string;
    hashtags: string[];
    keyword: string;
    engagement: Engagement;
  }

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      alert("✅ Post copied to clipboard!");
    } catch {
      alert("⚠️ Failed to copy text.");
    }
  };

  return (
    <Layout>
      <Header
        title="Viral Post Search"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showBackButton
      />
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#fc00ff33] to-transparent my-2" />
      <div className="w-full p-7">
        <div className="max-w-3xl mx-auto text-sm">
          {/* Removed the outer rounded-md p-8 div as requested */}
          <div className="space-y-6">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a259ff] w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-[#3d246c] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a259ff] text-sm"
                  style={{ background: "rgba(70, 70, 70, 0.25)" }}
                  placeholder="e.g. startup tips, AI tools, founder story..."
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching || !searchTerm.trim()}
                className={`btn btn--default font-medium flex items-center space-x-2 text-sm${
                  isSearching || !searchTerm.trim() ? "" : ""
                }`}
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    <span>Generate Posts</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
              <div
                className="rounded-md p-3 text-center"
                style={{ background: "rgba(70, 70, 70, 0.25)" }}
              >
                <img
                  src="/AI Powered.png"
                  alt="AI Powered"
                  className="w-7 h-7 mx-auto mb-2"
                  style={{ objectFit: "contain" }}
                />
                <h3 className="font-semibold text-white text-base">
                  AI-Powered
                </h3>
                <p className="text-xs text-gray-400">
                  Viral content generation
                </p>
              </div>
              <div
                className="rounded-md p-3 text-center"
                style={{ background: "rgba(70, 70, 70, 0.25)" }}
              >
                <img
                  src="/Trend.png"
                  alt="Trend-Based Topics"
                  className="w-7 h-7 mx-auto mb-2"
                  style={{ objectFit: "contain" }}
                />
                <h3 className="font-semibold text-white text-base">
                  Trend-Based Topics
                </h3>
                <p className="text-xs text-gray-400">Optimized by GPT</p>
              </div>
              <div
                className="rounded-md p-3 text-center"
                style={{ background: "rgba(70, 70, 70, 0.25)" }}
              >
                <img
                  src="/Heart.png"
                  alt="Audience Appeal"
                  className="w-7 h-7 mx-auto mb-2"
                  style={{ objectFit: "contain" }}
                />
                <h3 className="font-semibold text-white text-base">
                  Audience Appeal
                </h3>
                <p className="text-xs text-gray-400">
                  Get engagement-ready copy
                </p>
              </div>
            </div>

            {error && <p className="text-[#ff5fa2]">{error}</p>}

            {results.length === 0 && !isSearching && (
              <div className="text-center py-12 text-gray-400">
                <Search className="w-16 h-16 mx-auto mb-4 opacity-50 text-[#a259ff]" />
                <p>Enter a keyword or topic to generate viral LinkedIn posts</p>
              </div>
            )}
          </div>
        </div>
        {/* Results container moved outside max-w-4xl for full width */}
        {results.length > 0 && (
          <div className="space-y-4 mt-8">
            <h3 className="text-lg font-semibold text-white">
              Generated Posts
            </h3>
            {results.map((post, index) => (
              <div
                key={index}
                className="rounded-md p-6 mx-auto"
                style={{
                  background: "rgba(70, 70, 70, 0.25)",
                  maxWidth: "100%",
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">
                      {post.tone || "Viral"} Post
                    </p>
                    <p className="text-white text-sm whitespace-pre-line mb-4">
                      {post.text}
                    </p>
                    {post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {post.hashtags.map((tag, i) => (
                          <span
                            key={i}
                            className="bg-[#3d246c] text-white px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-400">
                      Keyword:{" "}
                      <span className="text-white">{post.keyword}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(post.text)}
                    className="btn btn--default font-medium flex items-center justify-center p-2 w-9 h-9"
                    title="Copy post"
                  >
                    <ClipboardCopy className="w-5 h-5" />
                  </button>
                </div>
                {post.engagement && (
                  <div className="flex items-center space-x-6 text-sm text-gray-400 mt-4">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-[#ff5fa2]" />
                      <span>{post.engagement.likes || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>💬</span>
                      <span>{post.engagement.comments || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Share className="w-4 h-4 text-[#6c47ff]" />
                      <span>{post.engagement.shares || 0}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ViralPostSearch;

import { useState } from "react";
import {
  Clock,
  Search,
  Calendar,
  Copy,
  ExternalLink,
  Trash2,
  Edit,
  CheckCircle,
} from "lucide-react";
import type { GeneratedPost } from "../services/api";

interface PostHistoryProps {
  posts: GeneratedPost[];
  onPostUpdate: (post: GeneratedPost) => void;
}

const PostHistory = ({ posts, onPostUpdate }: PostHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTone, setFilterTone] = useState<string>("all");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "tone" | "source">("date");
  const [toneDropdownOpen, setToneDropdownOpen] = useState(false);
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  const filteredPosts = posts
    .filter((post) => {
      const matchesSearch =
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.originalContent?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTone = filterTone === "all" || post.tone === filterTone;
      const matchesSource =
        filterSource === "all" || post.sourceType === filterSource;

      return matchesSearch && matchesTone && matchesSource;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "tone":
          return a.tone.localeCompare(b.tone);
        case "source":
          return a.sourceType.localeCompare(b.sourceType);
        default:
          return 0;
      }
    });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const toggleScheduled = (post: GeneratedPost) => {
    const updatedPost = { ...post, isScheduled: !post.isScheduled };
    onPostUpdate(updatedPost);
  };

  const deletePost = (postId: string) => {
    // In a real app, this would make an API call
    console.log("Delete post:", postId);
  };

  const getToneColor = (tone: string) => {
    const colors = {
      storytelling: "bg-purple-600",
      educational: "bg-blue-600",
      inspirational: "bg-green-600",
      professional: "bg-gray-600",
      conversational: "bg-yellow-600",
    };
    return colors[tone as keyof typeof colors] || "bg-gray-600";
  };

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case "notion":
        return "📝";
      case "google_docs":
        return "📄";
      default:
        return "📋";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-xl p-6 border border-[#333333]"
        style={{ background: "rgba(70, 70, 70, 0.25)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-[#a259ff]" />
            <h2 className="text-xl font-semibold text-white">
              Generated Posts ({posts.length})
            </h2>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>
              {filteredPosts.filter((p) => p.isScheduled).length} scheduled
            </span>
            <span>•</span>
            <span>
              {filteredPosts.filter((p) => !p.isScheduled).length} drafts
            </span>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 text-[#a259ff] absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#232136] border border-[#333333] text-white pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-[#a259ff] focus:border-transparent placeholder:text-[#a259ff]/60"
              />
            </div>
          </div>

          {/* Tone Dropdown */}
          <div className="relative">
            <label className="block text-gray-300 text-sm mb-2">Tone</label>
            <button
              type="button"
              className="w-full border border-[#333333] text-white rounded-lg px-3 py-2 bg-[#232136] text-sm shadow-lg z-10 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#a259ff]"
              onClick={() => setToneDropdownOpen((open) => !open)}
            >
              <span>
                {(() => {
                  switch (filterTone) {
                    case "all":
                      return "All Tones";
                    case "storytelling":
                      return "Storytelling";
                    case "educational":
                      return "Educational";
                    case "inspirational":
                      return "Inspirational";
                    case "professional":
                      return "Professional";
                    case "conversational":
                      return "Conversational";
                    default:
                      return "All Tones";
                  }
                })()}
              </span>
              <svg
                className={`ml-2 transition-transform duration-200 ${
                  toneDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 8L10 12L14 8"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {toneDropdownOpen && (
              <div className="absolute left-0 top-full w-full bg-[#232136] border border-[#333333] rounded-lg shadow-lg z-20 mt-1 overflow-hidden">
                {[
                  { value: "all", label: "All Tones" },
                  { value: "storytelling", label: "Storytelling" },
                  { value: "educational", label: "Educational" },
                  { value: "inspirational", label: "Inspirational" },
                  { value: "professional", label: "Professional" },
                  { value: "conversational", label: "Conversational" },
                ].map((opt) => (
                  <div
                    key={opt.value}
                    className={`px-4 py-2 cursor-pointer text-white transition-colors ${
                      filterTone === opt.value ? "bg-white/10" : ""
                    } hover:bg-white/10`}
                    onClick={() => {
                      setFilterTone(opt.value);
                      setToneDropdownOpen(false);
                    }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Source Dropdown */}
          <div className="relative">
            <label className="block text-gray-300 text-sm mb-2">Source</label>
            <button
              type="button"
              className="w-full border border-[#333333] text-white rounded-lg px-3 py-2 bg-[#232136] text-sm shadow-lg z-10 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#a259ff]"
              onClick={() => setSourceDropdownOpen((open) => !open)}
            >
              <span>
                {(() => {
                  switch (filterSource) {
                    case "all":
                      return "All Sources";
                    case "notion":
                      return "Notion";
                    case "google_docs":
                      return "Google Docs";
                    case "manual":
                      return "Manual";
                    default:
                      return "All Sources";
                  }
                })()}
              </span>
              <svg
                className={`ml-2 transition-transform duration-200 ${
                  sourceDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 8L10 12L14 8"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {sourceDropdownOpen && (
              <div className="absolute left-0 top-full w-full bg-[#232136] border border-[#333333] rounded-lg shadow-lg z-20 mt-1 overflow-hidden">
                {[
                  { value: "all", label: "All Sources" },
                  { value: "notion", label: "Notion" },
                  { value: "google_docs", label: "Google Docs" },
                  { value: "manual", label: "Manual" },
                ].map((opt) => (
                  <div
                    key={opt.value}
                    className={`px-4 py-2 cursor-pointer text-white transition-colors ${
                      filterSource === opt.value ? "bg-white/10" : ""
                    } hover:bg-white/10`}
                    onClick={() => {
                      setFilterSource(opt.value);
                      setSourceDropdownOpen(false);
                    }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <label className="block text-gray-300 text-sm mb-2">Sort By</label>
            <button
              type="button"
              className="w-full border border-[#333333] text-white rounded-lg px-3 py-2 bg-[#232136] text-sm shadow-lg z-10 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#a259ff]"
              onClick={() => setSortDropdownOpen((open) => !open)}
            >
              <span>
                {(() => {
                  switch (sortBy) {
                    case "date":
                      return "Date Created";
                    case "tone":
                      return "Tone";
                    case "source":
                      return "Source";
                    default:
                      return "Date Created";
                  }
                })()}
              </span>
              <svg
                className={`ml-2 transition-transform duration-200 ${
                  sortDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 8L10 12L14 8"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {sortDropdownOpen && (
              <div className="absolute left-0 top-full w-full bg-[#232136] border border-[#333333] rounded-lg shadow-lg z-20 mt-1 overflow-hidden">
                {[
                  { value: "date", label: "Date Created" },
                  { value: "tone", label: "Tone" },
                  { value: "source", label: "Source" },
                ].map((opt) => (
                  <div
                    key={opt.value}
                    className={`px-4 py-2 cursor-pointer text-white transition-colors ${
                      sortBy === opt.value ? "bg-white/10" : ""
                    } hover:bg-white/10`}
                    onClick={() => {
                      setSortBy(opt.value as "date" | "tone" | "source");
                      setSortDropdownOpen(false);
                    }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="rounded-xl p-8 text-center border border-transparent bg-gradient-to-br from-[#232136] via-[#2d1e4a] to-[#00dbde]/10 shadow-[0_4px_32px_0_rgba(162,89,255,0.10)]">
            <Clock className="w-12 h-12 text-[#a259ff] mx-auto mb-4" />
            <p className="text-gray-200 mb-2">No posts found</p>
            <p className="text-gray-400 text-sm">
              {posts.length === 0
                ? "Generate your first post to see it here"
                : "Try adjusting your search and filters"}
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="rounded-xl p-6 border border-[#333333]"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">
                    {getSourceIcon(post.sourceType)}
                  </span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded text-xs text-white ${getToneColor(
                          post.tone
                        )}`}
                      >
                        {post.tone}
                      </span>
                      <span className="px-2 py-1 bg-[#232136] rounded text-xs text-white">
                        {post.sourceType}
                      </span>
                      {post.isScheduled && (
                        <span className="px-2 py-1 bg-gradient-to-r from-[#00dbde] to-[#a259ff] rounded text-xs text-white flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Scheduled</span>
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mt-1">
                      {new Date(post.createdAt).toLocaleString()}
                      {post.wordCount && ` • ${post.wordCount} words`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(post.content)}
                    className="text-[#a259ff] hover:text-[#fc00ff] p-2 rounded transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleScheduled(post)}
                    className={`p-2 ${
                      post.isScheduled ? "text-[#00dbde]" : "text-gray-400"
                    } hover:text-[#a259ff]`}
                    title={post.isScheduled ? "Unschedule" : "Schedule"}
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                  <button
                    className="text-gray-400 hover:text-[#a259ff] p-2"
                    title="Edit post"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-gray-400 hover:text-[#ff5fa2] p-2"
                    title="Delete post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <div className="space-y-4">
                <div
                  className={`cursor-pointer ${
                    expandedPost === post.id ? "" : "line-clamp-3"
                  }`}
                  onClick={() =>
                    setExpandedPost(expandedPost === post.id ? null : post.id)
                  }
                >
                  <pre className="text-gray-200 text-sm whitespace-pre-wrap font-sans">
                    {post.content}
                  </pre>
                </div>

                {post.content.length > 200 && (
                  <button
                    onClick={() =>
                      setExpandedPost(expandedPost === post.id ? null : post.id)
                    }
                    className="text-[#a259ff] hover:text-[#fc00ff] text-sm"
                  >
                    {expandedPost === post.id ? "Show less" : "Read more"}
                  </button>
                )}
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#333333]">
                <div className="flex items-center space-x-2">
                  {post.sourceId && (
                    <button className="text-[#a259ff] hover:text-[#00dbde] text-sm flex items-center space-x-1">
                      <ExternalLink className="w-3 h-3" />
                      <span>View Source</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button className="bg-gradient-to-r from-[#6c47ff] to-[#a259ff] hover:from-[#fc00ff] hover:to-[#00dbde] text-white text-sm px-3 py-1 rounded">
                    Schedule
                  </button>
                  <button className="bg-gradient-to-r from-[#00dbde] to-[#fc00ff] hover:from-[#fc00ff] hover:to-[#00dbde] text-white text-sm px-3 py-1 rounded flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Publish</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostHistory;

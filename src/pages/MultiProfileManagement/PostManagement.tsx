import { useState, useEffect } from "react";
import {
  PlusCircle,
  Calendar,
  Edit3,
  Trash2,
  Eye,
  Clock,
  Send,
  CheckCircle,
  XCircle,
  MessageSquare,
  Heart,
  Share2,
  Search,
  BarChart3,
} from "lucide-react";
import { Profile } from "./services";
import { postService, Post, PostStatus } from "./postServices";

interface PostManagementProps {
  selectedProfile: Profile;
  onProfileChange: (profile: Profile) => void;
  profiles: Profile[];
}

const PostManagement = ({
  selectedProfile,
  onProfileChange,
  profiles,
}: PostManagementProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<PostStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);

  // Form state for creating posts
  const [newPost, setNewPost] = useState({
    content: "",
    scheduledDate: "",
    hashtags: "",
    authorName: "Demo User",
  });

  // Load posts for selected profile
  useEffect(() => {
    if (selectedProfile) {
      fetchPosts();
    }
  }, [selectedProfile._id, filter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await postService.getProfilePosts(
        selectedProfile._id,
        filter !== "all" ? filter : undefined
      );
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.content.trim()) {
      setError("Post content is required");
      return;
    }

    try {
      setCreateLoading(true);
      setError(null);

      const hashtags = newPost.hashtags
        .split(",")
        .map((tag) => tag.trim().replace("#", ""))
        .filter((tag) => tag.length > 0);

      const postData = {
        profileId: selectedProfile._id,
        content: newPost.content,
        scheduledDate: newPost.scheduledDate || undefined,
        hashtags,
        authorName: newPost.authorName,
      };

      const createdPost = await postService.createPost(postData);
      if (createdPost) {
        setPosts((prev) => [createdPost, ...prev]);
        setShowCreateModal(false);
        setNewPost({
          content: "",
          scheduledDate: "",
          hashtags: "",
          authorName: "Demo User",
        });
      } else {
        setError("Failed to create post");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const success = await postService.deletePost(postId);
      if (success) {
        setPosts((prev) => prev.filter((p) => p._id !== postId));
      } else {
        setError("Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete post");
    }
  };
  const getStatusBadge = (status: PostStatus) => {
    const statusConfig: Record<
      PostStatus,
      { color: string; text: string; icon: any }
    > = {
      draft: { color: "bg-gray-500", text: "Draft", icon: Edit3 },
      pending_approval: {
        color: "bg-yellow-500",
        text: "Pending",
        icon: Clock,
      },
      approved: { color: "bg-green-500", text: "Approved", icon: CheckCircle },
      scheduled: { color: "bg-blue-500", text: "Scheduled", icon: Calendar },
      published: { color: "bg-purple-500", text: "Published", icon: Send },
      rejected: { color: "bg-red-500", text: "Rejected", icon: XCircle },
      failed: { color: "bg-red-600", text: "Failed", icon: XCircle },
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${config.color}`}
      >
        <IconComponent className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };
  const filteredPosts = posts.filter(
    (post) =>
      searchQuery === "" ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.hashtags?.some((tag: string) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const getEngagementTotal = (post: Post) => {
    const { analytics } = post;
    return (
      (analytics?.likes || 0) +
      (analytics?.comments || 0) +
      (analytics?.shares || 0)
    );
  };

  const handleImportLinkedInPosts = async () => {
    if (
      !confirm(
        "Import your recent LinkedIn posts? This will fetch your latest posts from LinkedIn."
      )
    )
      return;

    try {
      setImportLoading(true);
      setError(null);

      const result = await postService.importLinkedInPosts(
        selectedProfile._id,
        20
      );
      if (result) {
        // Refresh posts to show imported content
        await fetchPosts();
        setError(null);
        alert(
          `Successfully imported ${result.imported} posts from LinkedIn! (${result.skipped} skipped as duplicates)`
        );
      } else {
        setError(
          "Failed to import LinkedIn posts. This may be due to LinkedIn API permissions or app configuration. Check console for details."
        );
      }
    } catch (err) {
      console.error("Error importing LinkedIn posts:", err);
      setError(
        "Failed to import LinkedIn posts. This may be due to LinkedIn API restrictions. Check browser console for details."
      );
    } finally {
      setImportLoading(false);
    }
  };

  const handleSyncAnalytics = async () => {
    if (
      !confirm(
        "Sync analytics for LinkedIn posts? This will update engagement metrics from LinkedIn."
      )
    )
      return;

    try {
      setSyncLoading(true);
      setError(null);

      const result = await postService.syncLinkedInAnalytics(
        selectedProfile._id
      );
      if (result) {
        // Refresh posts to show updated analytics
        await fetchPosts();
        setError(null);
        alert(
          `Analytics synced for ${result.updated} posts! (${result.failed} failed)`
        );
      } else {
        setError(
          "Failed to sync LinkedIn analytics. Please check your LinkedIn connection."
        );
      }
    } catch (err) {
      console.error("Error syncing analytics:", err);
      setError("Failed to sync analytics. Please try again.");
    } finally {
      setSyncLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Profile Selector */}
      <div className="bg-gray-800 rounded-lg p-6">
        {" "}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Content Management
            </h2>
            <p className="text-gray-400">
              Manage content for your LinkedIn profiles
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Post</span>
            </button>

            <button
              onClick={handleImportLinkedInPosts}
              disabled={importLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
            >
              {importLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <MessageSquare className="w-4 h-4" />
              )}
              <span>
                {importLoading ? "Importing..." : "Import from LinkedIn"}
              </span>
            </button>

            <button
              onClick={handleSyncAnalytics}
              disabled={syncLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
            >
              {syncLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <BarChart3 className="w-4 h-4" />
              )}
              <span>{syncLoading ? "Syncing..." : "Sync Analytics"}</span>
            </button>
          </div>
        </div>
        {/* Profile Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Active Profile
            </label>
            <select
              value={selectedProfile._id}
              onChange={(e) => {
                const profile = profiles.find((p) => p._id === e.target.value);
                if (profile) onProfileChange(profile);
              }}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
            >
              {profiles.map((profile) => (
                <option key={profile._id} value={profile._id}>
                  {profile.profileName} (
                  {profile.isActive ? "Active" : "Inactive"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status Filter
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as PostStatus | "all")}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Posts</option>
              <option value="draft">Drafts</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <XCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPosts.length === 0 ? (
          <div className="col-span-full">
            <div className="bg-gray-800 rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                No posts found
              </h3>
              <p className="text-gray-500 mb-6">
                {filter === "all"
                  ? "Start creating content for this profile"
                  : `No ${filter.replace("_", " ")} posts found`}
              </p>{" "}
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Create Your First Post
              </button>
            </div>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post._id}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {getStatusBadge(post.status)}
                  {post.scheduledDate && (
                    <div className="flex items-center text-sm text-gray-400 mt-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(post.scheduledDate).toLocaleString()}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-blue-400 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>{" "}
                  <button
                    className="text-gray-400 hover:text-red-400 transition-colors"
                    onClick={() => handleDeletePost(post._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-gray-300 text-sm line-clamp-3 mb-3">
                  {post.content}
                </p>
                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.hashtags
                      .slice(0, 3)
                      .map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    {post.hashtags.length > 3 && (
                      <span className="text-xs text-gray-400">
                        +{post.hashtags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Post Analytics */}
              {post.status === "published" && post.analytics && (
                <div className="border-t border-gray-700 pt-4">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="flex items-center justify-center text-red-400 mb-1">
                        <Heart className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-medium text-white">
                        {post.analytics.likes || 0}
                      </p>
                      <p className="text-xs text-gray-400">Likes</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center text-blue-400 mb-1">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-medium text-white">
                        {post.analytics.comments || 0}
                      </p>
                      <p className="text-xs text-gray-400">Comments</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center text-green-400 mb-1">
                        <Share2 className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-medium text-white">
                        {post.analytics.shares || 0}
                      </p>
                      <p className="text-xs text-gray-400">Shares</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center text-purple-400 mb-1">
                        <Eye className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-medium text-white">
                        {post.analytics.views || 0}
                      </p>
                      <p className="text-xs text-gray-400">Views</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Post Meta */}
              <div className="border-t border-gray-700 pt-4 mt-4">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>By {post.authorName}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Stats */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">{posts.length}</p>
            <p className="text-sm text-gray-400">Total Posts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">
              {posts.filter((p) => p.status === "published").length}
            </p>
            <p className="text-sm text-gray-400">Published</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">
              {posts.filter((p) => p.status === "scheduled").length}
            </p>
            <p className="text-sm text-gray-400">Scheduled</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">
              {posts
                .filter((p) => p.status === "published")
                .reduce((sum, post) => sum + getEngagementTotal(post), 0)}
            </p>
            <p className="text-sm text-gray-400">Total Engagement</p>{" "}
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Create New Post
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Profile
                </label>
                <div className="bg-gray-700 px-3 py-2 rounded-lg text-white">
                  {selectedProfile.profileName}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content *
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost((prev) => ({ ...prev, content: e.target.value }))
                  }
                  placeholder="What's on your mind?"
                  rows={6}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                />
                <div className="text-right mt-1">
                  <span
                    className={`text-sm ${
                      newPost.content.length > 3000
                        ? "text-red-400"
                        : "text-gray-400"
                    }`}
                  >
                    {newPost.content.length}/3000
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Hashtags
                </label>
                <input
                  type="text"
                  value={newPost.hashtags}
                  onChange={(e) =>
                    setNewPost((prev) => ({
                      ...prev,
                      hashtags: e.target.value,
                    }))
                  }
                  placeholder="marketing, linkedin, socialmedia (comma separated)"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Author Name
                </label>
                <input
                  type="text"
                  value={newPost.authorName}
                  onChange={(e) =>
                    setNewPost((prev) => ({
                      ...prev,
                      authorName: e.target.value,
                    }))
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Schedule For Later (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={newPost.scheduledDate}
                  onChange={(e) =>
                    setNewPost((prev) => ({
                      ...prev,
                      scheduledDate: e.target.value,
                    }))
                  }
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-700">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                disabled={createLoading || !newPost.content.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center space-x-2"
              >
                {createLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>
                      {newPost.scheduledDate ? "Schedule Post" : "Create Post"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostManagement;

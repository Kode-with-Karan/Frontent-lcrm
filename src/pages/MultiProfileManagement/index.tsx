import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Settings,
  Loader2,
  Calendar,
  AlertCircle,
  MessageSquare,
  BarChart3,
  UserCheck,
} from "lucide-react";
import { profileService, Profile } from "./services";
import ProfileCard from "./ProfileCard";
import ProfileEditModal from "./ProfileEditModal";
import PostManagement from "./PostManagement";

type TabType = "profiles" | "content" | "analytics" | "permissions";

const MultiProfileManagement = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingProfile, setConnectingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("profiles");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  // Load profiles on component mount
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileService.getProfiles();
      setProfiles(data);
    } catch (err) {
      console.error("Error fetching profiles:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load profiles. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConnectLinkedIn = async () => {
    try {
      setConnectingProfile(true);
      setError(null);

      const authUrl = await profileService.getLinkedInAuthUrl();

      // Open LinkedIn OAuth in a popup window
      const popup = window.open(
        authUrl,
        "linkedin-oauth",
        "width=600,height=600,scrollbars=yes,resizable=yes"
      );

      // Listen for the popup to close or send a message
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          setConnectingProfile(false);
          // Refresh profiles after potential new connection
          fetchProfiles();
        }
      }, 1000);

      // Listen for messages from the popup
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === "LINKEDIN_OAUTH_SUCCESS") {
          clearInterval(checkClosed);
          popup?.close();
          setConnectingProfile(false);
          fetchProfiles();
          window.removeEventListener("message", messageListener);
        } else if (event.data.type === "LINKEDIN_OAUTH_ERROR") {
          clearInterval(checkClosed);
          popup?.close();
          setConnectingProfile(false);
          setError(event.data.error || "LinkedIn connection failed");
          window.removeEventListener("message", messageListener);
        }
      };

      window.addEventListener("message", messageListener);
    } catch (err) {
      console.error("Error connecting to LinkedIn:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to connect to LinkedIn. Please try again."
      );
      setConnectingProfile(false);
    }
  };

  const handleActivateProfile = async (profileId: string) => {
    try {
      await profileService.activateProfile(profileId);
      // Update local state
      setProfiles((prev) =>
        prev.map((profile) => ({
          ...profile,
          isActive: profile._id === profileId,
        }))
      );
    } catch (err) {
      console.error("Error activating profile:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to activate profile. Please try again."
      );
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this profile? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await profileService.deleteProfile(profileId);
      // Remove from local state
      setProfiles((prev) =>
        prev.filter((profile) => profile._id !== profileId)
      );
    } catch (err) {
      console.error("Error deleting profile:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete profile. Please try again."
      );
    }
  };

  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (
    profileId: string,
    updateData: {
      name?: string;
      headline?: string;
      location?: string;
      linkedin_url?: string;
      avatar_url?: string;
    }
  ) => {
    try {
      const updatedProfile = await profileService.updateProfile(
        profileId,
        updateData
      );

      // Update local state
      setProfiles((prev) =>
        prev.map((profile) =>
          profile._id === profileId ? updatedProfile : profile
        )
      );

      setIsEditModalOpen(false);
      setEditingProfile(null);
    } catch (err) {
      console.error("Error updating profile:", err);
      throw err; // Re-throw to let the modal handle the error
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProfile(null);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            <span className="ml-3 text-gray-300">Loading profiles...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gray-800 rounded-lg p-8">
        {" "}
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-purple-600 rounded-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Multi-Profile Content Management
            </h1>
            <p className="text-gray-400">
              Manage multiple voices. One dashboard.
            </p>
          </div>
        </div>
        {/* Tab Navigation */}
        <div className="border-b border-gray-700 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("profiles")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "profiles"
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Profiles
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "content"
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Content
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "analytics"
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab("permissions")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "permissions"
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              <UserCheck className="w-4 h-4 inline mr-2" />
              Permissions
            </button>
          </nav>
        </div>
        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-300">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                ×
              </button>
            </div>
          </div>
        )}
        {/* Tab Content */}
        {activeTab === "profiles" && (
          <ProfilesTab
            profiles={profiles}
            connectingProfile={connectingProfile}
            handleConnectLinkedIn={handleConnectLinkedIn}
            handleActivateProfile={handleActivateProfile}
            handleDeleteProfile={handleDeleteProfile}
            handleEditProfile={handleEditProfile}
          />
        )}
        {activeTab === "content" && (
          <ContentTab
            profiles={profiles}
            selectedProfile={
              selectedProfile || profiles.find((p) => p.isActive) || profiles[0]
            }
            onProfileChange={setSelectedProfile}
          />
        )}
        {activeTab === "analytics" && (
          <AnalyticsTab
            profiles={profiles}
            selectedProfile={
              selectedProfile || profiles.find((p) => p.isActive) || profiles[0]
            }
          />
        )}
        {activeTab === "permissions" && (
          <PermissionsTab
            profiles={profiles}
            selectedProfile={
              selectedProfile || profiles.find((p) => p.isActive) || profiles[0]
            }
          />
        )}
        {/* Profile Edit Modal */}
        <ProfileEditModal
          profile={editingProfile}
          isOpen={isEditModalOpen}
          onSave={handleSaveProfile}
          onClose={handleCloseEditModal}
        />
      </div>
    </div>
  );
};

// Profiles Tab Component
const ProfilesTab = ({
  profiles,
  connectingProfile,
  handleConnectLinkedIn,
  handleActivateProfile,
  handleDeleteProfile,
  handleEditProfile,
}: {
  profiles: Profile[];
  connectingProfile: boolean;
  handleConnectLinkedIn: () => void;
  handleActivateProfile: (id: string) => void;
  handleDeleteProfile: (id: string) => void;
  handleEditProfile: (profile: Profile) => void;
}) => (
  <>
    {/* Profiles Header */}
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Connected Profiles</h3>
        <p className="text-sm text-gray-400">
          {profiles.length} profile{profiles.length !== 1 ? "s" : ""} connected
        </p>
      </div>
      <button
        onClick={handleConnectLinkedIn}
        disabled={connectingProfile}
        className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
      >
        {connectingProfile ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
        <span>{connectingProfile ? "Connecting..." : "Add Profile"}</span>
      </button>
    </div>

    {/* Profiles Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile._id}
          profile={profile}
          onActivate={handleActivateProfile}
          onDelete={handleDeleteProfile}
          onEdit={handleEditProfile}
        />
      ))}

      {/* Add New Profile Card */}
      <div className="bg-gray-700 rounded-lg p-6 border-2 border-dashed border-gray-600 hover:border-gray-500 transition-colors">
        <div className="text-center py-8">
          <Plus className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h4 className="font-semibold text-gray-400 mb-2">Add New Profile</h4>
          <p className="text-sm text-gray-500 mb-4">
            Connect another LinkedIn account for clients or team members
          </p>
          <button
            onClick={handleConnectLinkedIn}
            disabled={connectingProfile}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
          >
            {connectingProfile ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>
              {connectingProfile ? "Connecting..." : "Connect Profile"}
            </span>
          </button>
        </div>
      </div>
    </div>

    {/* Features Section */}
    <div className="bg-gray-700 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Features per Profile
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ul className="space-y-3 text-sm text-gray-300">
          <li className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Individual content calendars</span>
          </li>
          <li className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Custom tone and voice settings</span>
          </li>
          <li className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Role-based content generation</span>
          </li>
        </ul>
        <ul className="space-y-3 text-sm text-gray-300">
          <li className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Performance analytics per profile</span>
          </li>
          <li className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Team member permissions</span>
          </li>
          <li className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Bulk content operations</span>
          </li>
        </ul>
      </div>
    </div>

    {/* Quick Actions */}
    {profiles.length > 0 && (
      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-3 px-4 rounded-lg transition-colors flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Bulk Schedule Posts</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 px-4 rounded-lg transition-colors flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Manage Permissions</span>
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-3 px-4 rounded-lg transition-colors flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Analytics Dashboard</span>
          </button>
        </div>
      </div>
    )}
  </>
);

// Content Tab Component
const ContentTab = ({
  profiles,
  selectedProfile,
  onProfileChange,
}: {
  profiles: Profile[];
  selectedProfile: Profile;
  onProfileChange: (profile: Profile) => void;
}) => {
  if (!selectedProfile) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          No Profile Selected
        </h3>
        <p className="text-gray-400">
          Select a profile to start managing content
        </p>
      </div>
    );
  }

  return (
    <PostManagement
      selectedProfile={selectedProfile}
      onProfileChange={onProfileChange}
      profiles={profiles}
    />
  );
};

// Analytics Tab Component
const AnalyticsTab = ({
  profiles: _profiles,
  selectedProfile,
}: {
  profiles: Profile[];
  selectedProfile: Profile;
}) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedProfile) {
      fetchAnalyticsData();
    }
  }, [selectedProfile._id]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Import postService dynamically to get real post data
      const { postService } = await import("./postServices");
      const data = await postService.getProfilePosts(selectedProfile._id);
      setPosts(data);
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          Error Loading Analytics
        </h3>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const publishedPosts = posts.filter((p) => p.status === "published");
  const totalEngagement = publishedPosts.reduce((sum, post) => {
    const analytics = post.analytics || {};
    return (
      sum +
      (analytics.likes || 0) +
      (analytics.comments || 0) +
      (analytics.shares || 0)
    );
  }, 0);
  const totalViews = publishedPosts.reduce(
    (sum, post) => sum + (post.analytics?.views || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="bg-gray-700 rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          {selectedProfile.profileData?.profilePicture ? (
            <img
              src={selectedProfile.profileData.profilePicture}
              alt={selectedProfile.profileName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-lg">
                {selectedProfile.profileName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-white">
              {selectedProfile.profileName}
            </h3>
            <p className="text-sm text-gray-400">Performance Analytics</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-300">Total Posts</h4>
            <MessageSquare className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white">{posts.length}</p>
          <p className="text-sm text-gray-400">All time</p>
        </div>

        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-300">Published</h4>
            <BarChart3 className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {publishedPosts.length}
          </p>
          <p className="text-sm text-gray-400">Live posts</p>
        </div>

        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-300">Total Views</h4>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {totalViews.toLocaleString()}
          </p>
          <p className="text-sm text-gray-400">Impressions</p>
        </div>

        <div className="bg-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-300">Engagement</h4>
            <BarChart3 className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white">{totalEngagement}</p>
          <p className="text-sm text-gray-400">Total interactions</p>
        </div>
      </div>

      {/* Post Status Distribution */}
      <div className="bg-gray-700 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-white mb-6">
          Content Status Distribution
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { status: "published", label: "Published", color: "bg-green-500" },
            { status: "scheduled", label: "Scheduled", color: "bg-blue-500" },
            { status: "draft", label: "Drafts", color: "bg-gray-500" },
            {
              status: "pending_approval",
              label: "Pending",
              color: "bg-yellow-500",
            },
          ].map(({ status, label, color }) => {
            const count = posts.filter((p) => p.status === status).length;
            const percentage =
              posts.length > 0
                ? ((count / posts.length) * 100).toFixed(1)
                : "0";

            return (
              <div key={status} className="text-center">
                <div
                  className={`w-16 h-16 ${color} rounded-full flex items-center justify-center mx-auto mb-2`}
                >
                  <span className="text-white font-bold text-lg">{count}</span>
                </div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-gray-400">{percentage}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Performing Posts */}
      {publishedPosts.length > 0 && (
        <div className="bg-gray-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-6">
            Top Performing Posts
          </h4>
          <div className="space-y-4">
            {publishedPosts
              .sort((a, b) => {
                const aEng =
                  (a.analytics?.likes || 0) +
                  (a.analytics?.comments || 0) +
                  (a.analytics?.shares || 0);
                const bEng =
                  (b.analytics?.likes || 0) +
                  (b.analytics?.comments || 0) +
                  (b.analytics?.shares || 0);
                return bEng - aEng;
              })
              .slice(0, 5)
              .map((post, index) => {
                const engagement =
                  (post.analytics?.likes || 0) +
                  (post.analytics?.comments || 0) +
                  (post.analytics?.shares || 0);
                return (
                  <div key={post._id} className="bg-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-300 line-clamp-2 mb-2">
                          {post.content}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span>👍 {post.analytics?.likes || 0}</span>
                          <span>💬 {post.analytics?.comments || 0}</span>
                          <span>🔄 {post.analytics?.shares || 0}</span>
                          <span>👁️ {post.analytics?.views || 0}</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm font-bold text-purple-400">
                          #{index + 1}
                        </div>
                        <div className="text-xs text-gray-400">
                          {engagement} total
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {posts.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No Analytics Data
          </h3>
          <p className="text-gray-400">
            Create some posts to see analytics and performance data
          </p>
        </div>
      )}
    </div>
  );
};

// Permissions Tab Component
const PermissionsTab = ({
  profiles: _profiles,
  selectedProfile: _selectedProfile,
}: {
  profiles: Profile[];
  selectedProfile: Profile;
}) => (
  <div className="space-y-6">
    <div className="text-center py-12">
      <UserCheck className="w-16 h-16 text-gray-500 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-300 mb-2">
        Permission Management
      </h3>
      <p className="text-gray-400">
        Manage team access and roles for your profiles
      </p>
    </div>
  </div>
);

export default MultiProfileManagement;

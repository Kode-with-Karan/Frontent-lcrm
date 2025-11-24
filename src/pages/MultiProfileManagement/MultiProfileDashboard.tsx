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
  Edit3,
  Trash2,
} from "lucide-react";
import { profileService, Profile } from "./services";
import ProfileCard from "./ProfileCard";
import ProfileEditModal from "./ProfileEditModal";

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

  // Set the first active profile as selected when profiles load
  useEffect(() => {
    if (profiles.length > 0 && !selectedProfile) {
      const activeProfile = profiles.find((p) => p.isActive) || profiles[0];
      setSelectedProfile(activeProfile);
    }
  }, [profiles, selectedProfile]);

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
          <div>
            {/* Profiles Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Connected Profiles
                </h3>
                <p className="text-sm text-gray-400">
                  {profiles.length} profile{profiles.length !== 1 ? "s" : ""}{" "}
                  connected
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
                <span>
                  {connectingProfile ? "Connecting..." : "Add Profile"}
                </span>
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
                  <h4 className="font-semibold text-gray-400 mb-2">
                    Add New Profile
                  </h4>
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
                <h3 className="text-lg font-semibold text-white mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab("content")}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-3 px-4 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Manage Content</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("permissions")}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 px-4 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Manage Permissions</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("analytics")}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-3 px-4 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>View Analytics</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "content" && selectedProfile && (
          <div className="space-y-6">
            {/* Profile Selector */}
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
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
                    <p className="text-sm text-gray-400">
                      {selectedProfile.profileData?.headline ||
                        "LinkedIn Profile"}
                    </p>
                  </div>
                </div>
                <select
                  value={selectedProfile._id}
                  onChange={(e) => {
                    const profile = profiles.find(
                      (p) => p._id === e.target.value
                    );
                    if (profile) setSelectedProfile(profile);
                  }}
                  className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  {profiles.map((profile) => (
                    <option key={profile._id} value={profile._id}>
                      {profile.profileName} {profile.isActive ? "(Active)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Content Management Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Post Stats */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h4 className="font-semibold text-white mb-4">
                  Content Overview
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Published Posts</span>
                    <span className="text-green-400 font-medium">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Scheduled Posts</span>
                    <span className="text-blue-400 font-medium">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Draft Posts</span>
                    <span className="text-yellow-400 font-medium">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Pending Review</span>
                    <span className="text-orange-400 font-medium">3</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h4 className="font-semibold text-white mb-4">Quick Actions</h4>
                <div className="space-y-3">
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Create New Post</span>
                  </button>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Schedule Content</span>
                  </button>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>View Analytics</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h4 className="font-semibold text-white mb-4">
                  Recent Activity
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">Post published 2h ago</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">
                      Content scheduled for tomorrow
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-300">Draft saved 1h ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Calendar Preview */}
            <div className="bg-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-white">Upcoming Content</h4>
                <button className="text-purple-400 hover:text-purple-300 text-sm">
                  View Full Calendar
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400">
                        Tomorrow, 9:00 AM
                      </span>
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                        Scheduled
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">
                      Sample content about industry insights and thought
                      leadership...
                    </p>
                    <div className="flex items-center space-x-2 mt-3">
                      <button className="text-gray-400 hover:text-blue-400">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Analytics Dashboard
              </h3>
              <p className="text-gray-400">
                Track performance across all your profiles
              </p>
              <div className="mt-6">
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "permissions" && (
          <div className="space-y-6">
            <div className="text-center py-12">
              <UserCheck className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Permission Management
              </h3>
              <p className="text-gray-400">
                Manage team access and roles for your profiles
              </p>
              <div className="mt-6 space-y-4">
                <div className="bg-gray-700 rounded-lg p-6 max-w-2xl mx-auto">
                  <h4 className="font-semibold text-white mb-4">
                    Available Roles
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                      <div>
                        <h5 className="font-medium text-white">Write Only</h5>
                        <p className="text-sm text-gray-400">
                          Can create and edit content, but cannot publish
                        </p>
                      </div>
                      <span className="text-yellow-400 text-sm">
                        Requires Review
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                      <div>
                        <h5 className="font-medium text-white">Review</h5>
                        <p className="text-sm text-gray-400">
                          Can review, approve, and publish content
                        </p>
                      </div>
                      <span className="text-green-400 text-sm">
                        Full Access
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                      <div>
                        <h5 className="font-medium text-white">Admin</h5>
                        <p className="text-sm text-gray-400">
                          Full access including user management
                        </p>
                      </div>
                      <span className="text-purple-400 text-sm">
                        All Permissions
                      </span>
                    </div>
                  </div>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
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

export default MultiProfileManagement;

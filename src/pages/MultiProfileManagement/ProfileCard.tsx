import {
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Trash2,
  Edit3,
} from "lucide-react";
import { Profile } from "./services";

interface ProfileCardProps {
  profile: Profile;
  onActivate: (profileId: string) => void;
  onDelete: (profileId: string) => void;
  onEdit: (profile: Profile) => void;
}

const ProfileCard = ({
  profile,
  onActivate,
  onDelete,
  onEdit,
}: ProfileCardProps) => {
  const getProfileStatus = (profile: Profile) => {
    const expiresAt = new Date(profile.tokenExpiresAt);
    const now = new Date();

    if (expiresAt < now) {
      return "expired";
    }
    return "active";
  };

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (status === "expired") {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-900 text-red-300">
          <AlertCircle className="w-3 h-3 mr-1" />
          Token Expired
        </span>
      );
    }

    if (isActive) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active Profile
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
        Connected
      </span>
    );
  };

  const status = getProfileStatus(profile);

  return (
    <div
      className={`bg-gray-700 rounded-lg p-6 border-2 transition-all ${
        profile.isActive
          ? "border-purple-500 ring-2 ring-purple-500/20"
          : "border-gray-600 hover:border-gray-500"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {profile.profileData?.profilePicture ? (
            <img
              src={profile.profileData.profilePicture}
              alt={profile.profileName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-lg">
                {profile.profileName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white truncate">
              {profile.profileName}
            </h4>
            <p className="text-sm text-gray-400 truncate">
              {profile.profileData?.headline || "LinkedIn Profile"}
            </p>{" "}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(profile)}
            className="text-gray-400 hover:text-blue-400 transition-colors"
            title="Edit Profile"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(profile._id)}
            className="text-gray-400 hover:text-red-400 transition-colors"
            title="Delete Profile"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between text-gray-300">
          <span>Location:</span>
          <span className="text-gray-300 truncate ml-2">
            {profile.profileData?.location || "Not specified"}
          </span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Industry:</span>
          <span className="text-gray-300 truncate ml-2">
            {profile.profileData?.industry || "Not specified"}
          </span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Connections:</span>
          <span className="text-blue-400">
            {profile.profileData?.connections
              ? profile.profileData.connections.toLocaleString()
              : "N/A"}
          </span>
        </div>
      </div>

      <div className="mb-4">{getStatusBadge(status, profile.isActive)}</div>

      <div className="flex space-x-2">
        {!profile.isActive && status === "active" && (
          <button
            onClick={() => onActivate(profile._id)}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
          >
            Activate
          </button>
        )}
        <a
          href={profile.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
        >
          <ExternalLink className="w-3 h-3" />
          <span>View</span>
        </a>
      </div>
    </div>
  );
};

export default ProfileCard;

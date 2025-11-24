import React from "react";
import { User } from "lucide-react";
import { useUser } from "../context/UserContext";
import { getDisplayName as getUserDisplayName } from "../utils/userUtils";

interface UserAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  showName?: boolean;
  showEmail?: boolean;
  showTitle?: boolean;
  className?: string;
  onClick?: () => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  size = "md",
  showName = false,
  showEmail = false,
  showTitle = false,
  className = "",
  onClick,
}) => {
  const { userProfile, loading } = useUser();

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  const getDisplayName = () => {
    return getUserDisplayName(userProfile);
  };

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div
          className={`${sizeClasses[size]} bg-gray-600 rounded-full animate-pulse`}
        />
        {(showName || showEmail || showTitle) && (
          <div className="flex flex-col gap-1">
            {showName && (
              <div className="h-4 w-20 bg-gray-600 rounded animate-pulse" />
            )}
            {showEmail && (
              <div className="h-3 w-16 bg-gray-600 rounded animate-pulse" />
            )}
            {showTitle && (
              <div className="h-3 w-24 bg-gray-600 rounded animate-pulse" />
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
    >
      {userProfile?.photoURL ? (
        <img
          src={userProfile.photoURL}
          alt="User avatar"
          className={`${
            sizeClasses[size]
          } rounded-full object-cover ring-2 ring-gray-500/50 ${
            onClick ? "hover:scale-110 transition-transform" : ""
          }`}
          onError={(e) => {
            e.currentTarget.src = "";
          }}
        />
      ) : (
        <User
          className={`rounded-full bg-gray-800 border-2 border-[#fc00ff]/30 text-[#fc00ff] ${
            size === "sm"
              ? "w-6 h-6 p-1"
              : size === "md"
              ? "w-8 h-8 p-2"
              : size === "lg"
              ? "w-10 h-10 p-2"
              : "w-12 h-12 p-3"
          }`}
          aria-label="User Icon"
        />
      )}

      {(showName || showEmail || showTitle) && (
        <div className="flex flex-col min-w-0 flex-1">
          {showName && (
            <div
              className={`font-medium text-white ${textSizes[size]} truncate`}
            >
              {getDisplayName()}
            </div>
          )}
          {showEmail && (
            <div
              className={`text-gray-400 ${
                textSizes[size] === "text-lg" ? "text-sm" : "text-xs"
              } truncate`}
            >
              {userProfile?.email || "user@example.com"}
            </div>
          )}
          {showTitle && (
            <div
              className={`text-gray-500 ${
                textSizes[size] === "text-lg" ? "text-sm" : "text-xs"
              } truncate`}
            >
              {userProfile?.title || "Lead Product Designer"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;

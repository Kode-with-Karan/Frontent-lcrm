import { UserProfile } from "../context/UserContext";
export const getDisplayName = (userProfile: UserProfile | null): string => {
  if (!userProfile) return "User";
  if (userProfile.displayName?.trim()) {
    return userProfile.displayName.trim();
  }
  if (userProfile.firstName?.trim() && userProfile.lastName?.trim()) {
    return `${userProfile.firstName.trim()} ${userProfile.lastName.trim()}`;
  }
  if (userProfile.firstName?.trim()) {
    return userProfile.firstName.trim();
  }
  if (userProfile.email) {
    const emailName = userProfile.email.split("@")[0];
    const nameParts = emailName.split(/[._-]/);
    if (nameParts.length > 1) {
      const firstName = formatNamePart(nameParts[0]);
      const lastName = formatNamePart(nameParts.slice(1).join(" "));
      return `${firstName} ${lastName}`;
    } else {
      return formatNamePart(nameParts[0]);
    }
  }
  return "User";
};

const formatNamePart = (namePart: string): string => {
  if (!namePart) return "";
  const spacedName = namePart.replace(/([A-Z])/g, " $1").trim();
  return spacedName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const getFirstName = (userProfile: UserProfile | null): string => {
  if (!userProfile) return "";
  if (userProfile.firstName?.trim()) {
    return userProfile.firstName.trim();
  }
  if (userProfile.displayName?.trim()) {
    return userProfile.displayName.split(" ")[0];
  }
  if (userProfile.email) {
    const emailName = userProfile.email.split("@")[0];
    const nameParts = emailName.split(/[._-]/);
    return formatNamePart(nameParts[0]);
  }
  return "";
};

export const getLastName = (userProfile: UserProfile | null): string => {
  if (!userProfile) return "";
  if (userProfile.lastName?.trim()) {
    return userProfile.lastName.trim();
  }
  if (userProfile.displayName?.trim()) {
    const parts = userProfile.displayName.split(" ");
    return parts.slice(1).join(" ");
  }
  if (userProfile.email) {
    const emailName = userProfile.email.split("@")[0];
    const nameParts = emailName.split(/[._-]/);
    if (nameParts.length > 1) {
      return formatNamePart(nameParts.slice(1).join(" "));
    }
  }
  return "";
};

export const getUserInitials = (userProfile: UserProfile | null): string => {
  if (!userProfile) return "U";
  const firstName = getFirstName(userProfile);
  const lastName = getLastName(userProfile);
  if (firstName && lastName) {
    return `${firstName.charAt(0).toUpperCase()}${lastName
      .charAt(0)
      .toUpperCase()}`;
  }
  if (firstName) {
    return firstName.charAt(0).toUpperCase();
  }
  if (userProfile.email) {
    return userProfile.email.charAt(0).toUpperCase();
  }
  return "U";
};

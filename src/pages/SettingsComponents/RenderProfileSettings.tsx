import React, { useState, useRef, useEffect } from 'react';
import { User, Camera, Save } from 'lucide-react';
import { updateProfile, User as FirebaseUser, Auth } from 'firebase/auth';
interface UserProfile {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  gender: string;
  residentialAddress: string;
}

const RenderProfileSettings = ({auth}: {auth: Auth}) => {
  
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    gender: '',
    residentialAddress: ''
  });
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        setUserProfile({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber
        });

        const names = user.displayName?.split(' ') || [];
        setProfileData(prev => ({
          ...prev,
          firstName: names[0] || '',
          lastName: names.slice(1).join(' ') || '',
          email: user.email || '',
          mobileNumber: user.phoneNumber || ''
        }));

        setProfilePicture(user.photoURL);
      }
    });

    return () => unsubscribe();
  }, []);

  const getDisplayName = (profile: UserProfile | null) => {
    return profile?.displayName || profile?.email?.split('@')[0] || 'User';
  };

  const getFirstName = (profile: UserProfile | null) => {
    return profile?.displayName?.split(' ')[0] || profile?.email?.split('@')[0] || '';
  };

  const getLastName = (profile: UserProfile | null) => {
    return profile?.displayName?.split(' ').slice(1).join(' ') || '';
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePicture(event.target?.result as string);
        setIsLoading(false);
        setSuccessMessage('Profile picture updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const displayName = `${profileData.firstName} ${profileData.lastName}`.trim();
      await updateProfile(currentUser, {
        displayName,
        photoURL: profilePicture || null
      });

      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!userProfile) {
    return <div className="text-white">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg p-4 border border-gray-700/50">
        <h3 className="text-xl font-semibold text-white mb-1">
          Welcome, {getDisplayName(userProfile)}!
        </h3>
        <p className="text-gray-400 text-sm">
          Manage your profile information and account preferences
        </p>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover ring-2 ring-gray-500/50"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <User
              className={`rounded-full bg-gray-800 border-2 border-[#fc00ff]/30 text-[#fc00ff] w-20 h-20 p-5`}
              aria-label="User Icon"
            />
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
            title="Click to change profile picture"
          />
          <button className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn--default font-medium text-sm"
          >
            Upload New
          </button>
          <button 
            className="ml-3 btn btn--default font-medium text-sm"
           onClick={async () => {
            try {
                if (auth.currentUser) {
                await updateProfile(auth.currentUser, { photoURL: "" });
                setProfilePicture(null);
                setSuccessMessage("Profile picture removed");
                setTimeout(() => setSuccessMessage(""), 3000);
                }
            } catch {
                setErrorMessage("Failed to remove profile picture");
                setTimeout(() => setErrorMessage(""), 3000);
            }
            }}
          >
            Delete avatar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            First Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={profileData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            placeholder={getFirstName(userProfile) || "Enter your first name"}
            className="w-full px-3 py-2 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#fc00ff] focus:border-transparent"
            style={{ background: "rgba(70, 70, 70, 0.25)" }}
            required
          />
          {!profileData.firstName && getFirstName(userProfile) && (
            <p className="text-xs text-gray-500 mt-1">
              💡 We extracted "{getFirstName(userProfile)}" from your email
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={profileData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            placeholder={getLastName(userProfile) || "Enter your last name"}
            className="w-full px-3 py-2 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#fc00ff] focus:border-transparent"
            style={{ background: "rgba(70, 70, 70, 0.25)" }}
          />
          {!profileData.lastName && getLastName(userProfile) && (
            <p className="text-xs text-gray-500 mt-1">
              💡 We extracted "{getLastName(userProfile)}" from your email
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={profileData.email}
            readOnly
            disabled
            placeholder="example@gmail.com"
            className="w-full px-3 py-2 border border-gray-600 rounded-md text-gray-400 placeholder-gray-500 bg-gray-800 cursor-not-allowed"
            title="Email cannot be changed"
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Mobile Number <span className="text-red-400">*</span>
          </label>
          <div className="flex">
            <div className="flex items-center px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-lg border-r-0">
              <span className="text-white text-sm">IN</span>
            </div>
            <input
              type="tel"
              value={profileData.mobileNumber}
              onChange={(e) =>
                handleInputChange("mobileNumber", e.target.value)
              }
              placeholder="0806 123 7890"
              className="flex-1 px-3 py-2 border border-gray-600 rounded-r-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#fc00ff] focus:border-transparent"
              style={{ background: "rgba(70, 70, 70, 0.25)" }}
              required
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Gender
          </label>
          <div className="flex space-x-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={profileData.gender === "male"}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-600 focus:ring-blue-500"
                style={{ background: "rgba(70, 70, 70, 0.25)" }}
              />
              <span className="ml-2 text-gray-300">Male</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={profileData.gender === "female"}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-600 focus:ring-blue-500"
                style={{ background: "rgba(70, 70, 70, 0.25)" }}
              />
              <span className="ml-2 text-gray-300">Female</span>
            </label>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Residential Address
          </label>
          <input
            type="text"
            value={profileData.residentialAddress}
            onChange={(e) =>
              handleInputChange("residentialAddress", e.target.value)
            }
            placeholder="Address line, City, State, Zip"
            className="w-full px-3 py-2 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#fc00ff] focus:border-transparent"
            style={{ background: "rgba(70, 70, 70, 0.25)" }}
          />
        </div>
      </div>

      {successMessage && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-md p-3 mb-4">
          <p className="text-green-300 text-sm">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-md p-3 mb-4">
          <p className="text-red-300 text-sm">{errorMessage}</p>
        </div>
      )}

      <div className="flex justify-end pt-6">
        <button
          onClick={handleSaveChanges}
          disabled={isLoading}
          className="btn btn--default font-medium flex items-center space-x-2 text-sm"
        >
          <Save className="w-4 h-4" />
          <span>{isLoading ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>
    </div>
  );
};

export default RenderProfileSettings;
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "firebase/auth";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  firstName: string;
  lastName: string;
  title?: string;
  company?: string;
  mobileNumber?: string;
  gender?: string;
  id?: string;  
  residentialAddress?: string;  
}

interface UserContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [firebaseUser, firebaseLoading] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  
  const loading = firebaseLoading || profileLoading;
  
  const createUserProfile = (user: User): UserProfile => {
    // Extract first name and last name from displayName or email
    let firstName = "";
    let lastName = "";

    if (user.displayName) {
      const nameParts = user.displayName.split(" ");
      firstName = nameParts[0] || "";
      lastName = nameParts.slice(1).join(" ") || "";
    } else if (user.email) {
      
      const emailName = user.email.split("@")[0];
      
      const nameParts = emailName.split(/[._-]/);

      if (nameParts.length > 1) {
        
        firstName = nameParts[0] || "";
        lastName = nameParts.slice(1).join(" ") || "";
      } else {
        
        firstName = nameParts[0] || "";
        lastName = "";
      }

      
      firstName = firstName.replace(/([A-Z])/g, " $1").trim();
      firstName =
        firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

      if (lastName) {
        lastName = lastName.replace(/([A-Z])/g, " $1").trim();
        lastName =
          lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
      }
    }

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      firstName: firstName,
      lastName: lastName,
      title: "",
      company: "",
      mobileNumber: "",
      gender: "",
      id: "",            
      residentialAddress: "",
    };
  };
  
  useEffect(() => {
    if (firebaseUser) {
      setProfileLoading(true);
      
      const storedProfile = localStorage.getItem(
        `userProfile_${firebaseUser.uid}`
      );

      if (storedProfile) {
        try {
          const parsedProfile = JSON.parse(storedProfile);          
          setUserProfile({
            ...parsedProfile,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });
        } catch (error) {
          console.error("Error parsing stored profile:", error);          
          setUserProfile(createUserProfile(firebaseUser));
        }
      } else {        
        setUserProfile(createUserProfile(firebaseUser));
      }

      setProfileLoading(false);
    } else {
      setUserProfile(null);
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (userProfile && firebaseUser) {
      localStorage.setItem(
        `userProfile_${firebaseUser.uid}`,
        JSON.stringify(userProfile)
      );
    }
  }, [userProfile, firebaseUser]);

  const updateProfile = async (
    updates: Partial<UserProfile>
  ): Promise<void> => {
    if (!userProfile || !firebaseUser) {
      throw new Error("No user logged in");
    }

    setProfileLoading(true);
    try {
      const updatedProfile = { ...userProfile, ...updates };
      setUserProfile(updatedProfile);

      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    } finally {
      setProfileLoading(false);
    }
  };

  const refreshProfile = async (): Promise<void> => {
    if (!firebaseUser) {
      throw new Error("No user logged in");
    }

    setProfileLoading(true);
    try {      
      setUserProfile(createUserProfile(firebaseUser));
    } catch (error) {
      console.error("Error refreshing profile:", error);
      throw error;
    } finally {
      setProfileLoading(false);
    }
  };

  const value: UserContextType = {
    user: firebaseUser || null,
    userProfile,
    loading,
    updateProfile,
    refreshProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;

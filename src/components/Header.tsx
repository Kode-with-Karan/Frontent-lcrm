import React, { useState, useRef, useEffect } from "react";
import {
  BellIcon,
  SearchIcon,
  ArrowLeft,
  X,
  Menu,
  User,
  LogOut,
  CreditCard,
  Shield,
  HelpCircleIcon,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { getFeatureDescription } from "../config/featureDescriptions";
import { useGlobalSearch, SearchSuggestion } from "../utils/globalSearch";
import { useMobile } from "../context/MobileContext";
import { useUser } from "../context/UserContext";
import { getDisplayName } from "../utils/userUtils";
import UserAvatar from "./UserAvatar";
import { auth } from "../firebase";

interface HeaderProps {
  title: string;
  description?: string;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  showBackButton?: boolean;
  onBack?: () => void;
  children?: React.ReactNode;
  showSearch?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  description,
  searchQuery,
  setSearchQuery,
  showBackButton = false,
  onBack,
  showSearch = true,
}) => {
  const location = useLocation();
  const { search, navigateToFeature } = useGlobalSearch();
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchSuggestion[]>([]);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const { isMobile, toggleSidebar } = useMobile();
  const { userProfile, loading: userLoading } = useUser();

  // Get dynamic description based on current route
  const dynamicDescription =
    description || getFeatureDescription(location.pathname);

  // Truncate title for mobile
  const getTruncatedTitle = (title: string) => {
    if (!isMobile) return title;
    return title.length > 25 ? title.substring(0, 25) + "..." : title;
  };

  // Handle search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = search(searchQuery);
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  }, [searchQuery, search]);

  // Close search results and user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
        // Also close mobile search when clicking outside
        if (isMobile) {
          setShowMobileSearch(false);
        }
      }

      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  // Close mobile search when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setShowMobileSearch(false);
    }
  }, [isMobile]);

  const handleSearchResultClick = (path: string) => {
    navigateToFeature(path);
    setSearchQuery("");
    setShowSearchResults(false);
    setShowMobileSearch(false);
  };

  return (
    <header
      className={`flex justify-between items-center sticky top-0 z-50 rounded-lg mb-6 ${
        isMobile ? "p-2 px-3" : "p-4"
      }`}
    >
      {/* Mobile hamburger menu */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-1.5 bg-transparent hover:bg-gray-700 text-white rounded-lg transition-all duration-200 mr-2 z-20 flex-shrink-0"
          title="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      <div
        className={`flex flex-col flex-1 relative ${isMobile ? "min-w-0" : ""}`}
      >
        {/* Back button slot */}
        {showBackButton && !isMobile && (
          <button
            onClick={onBack || (() => window.history.back())}
            className="p-2 bg-transparent hover:bg-gray-700 text-white rounded-full transition-all duration-200 absolute left-0 top-1 z-20 flex items-center"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h1
          className={`font-bold text-white drop-shadow-[0_2px_8px_rgba(252,0,255,0.15)] ${
            isMobile ? "text-base truncate" : "text-2xl"
          } ${
            showBackButton && !isMobile ? "ml-12" : isMobile ? "ml-0" : "ml-4"
          }`}
        >
          {getTruncatedTitle(title)}
        </h1>
        {/* Accent bar under heading */}
        <div
          className={`${
            showBackButton && !isMobile ? "ml-12" : isMobile ? "ml-0" : "ml-4"
          } mt-1 w-12 h-0.5 bg-gradient-to-r from-[#fc00ff] to-[#00dbde] rounded-full opacity-70`}
        />
        {/* Welcome message - hide on mobile */}
        {!isMobile && (
          <span
            className={`${
              showBackButton ? "ml-12" : "ml-4"
            } mt-2 text-sm text-gray-400`}
          >
            {dynamicDescription}
          </span>
        )}
      </div>

      {showSearch && (
        <div
          className={`flex items-center gap-2 rounded-xl  shadow-inner flex-shrink-0 ${
            isMobile ? "px-1.5 py-1" : "px-3 py-2"
          }`}
        >
          {/* Mobile Search Button/Input */}
          {isMobile ? (
            showMobileSearch ? (
              <div className="relative w-40" ref={searchRef}>
                <input
                  className="h-7 w-full rounded-lg border border-[#fc00ff] bg-black/50 pl-6 pr-6 text-white text-xs placeholder:text-[#505050] outline-none backdrop-blur-sm shadow-sm"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <SearchIcon className="absolute w-3 h-3 top-2 left-1.5 text-[#fc00ff]" />
                <button
                  onClick={() => {
                    setShowMobileSearch(false);
                    setSearchQuery("");
                    setShowSearchResults(false);
                  }}
                  className="absolute right-1.5 top-1.5 text-[#505050] hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
                {/* Mobile Search Results */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-black/95 border border-[#505050] rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        onClick={() => handleSearchResultClick(result.path)}
                        className="p-2 hover:bg-[#fc00ff]/20 cursor-pointer border-b border-[#505050]/30 last:border-b-0 transition-colors"
                      >
                        <h4 className="text-white text-xs font-medium truncate">
                          {result.title}
                        </h4>
                        <p className="text-gray-400 text-xs mt-0.5 truncate">
                          {result.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowMobileSearch(true)}
                className="p-1.5 text-[#505050] hover:text-white transition-colors flex-shrink-0"
                title="Search"
              >
                <SearchIcon className="w-4 h-4" />
              </button>
            )
          ) : (
            <>
              {/* Desktop Search */}
              <div className="relative w-[260px] max-w-[260px]" ref={searchRef}>
                <input
                  className={`h-10 w-full rounded-[8px] border border-solid bg-black/50 pl-10 pr-10 text-white placeholder:text-[#505050] outline-none backdrop-blur-sm shadow-sm transition-all duration-200 ${
                    searchQuery.length > 0
                      ? "border-[#fc00ff] shadow-[0_0_10px_rgba(252,0,255,0.3)]"
                      : "border-[#505050] focus:border-[#fc00ff]"
                  }`}
                  placeholder="Search features... (try: linkedin, voice, calendar, youtube)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchIcon
                  className={`absolute w-4 h-4 top-[11px] left-2.5 transition-colors duration-200 ${
                    searchQuery.length > 0 ? "text-[#fc00ff]" : "text-[#505050]"
                  }`}
                />{" "}
                {searchQuery.length > 0 && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-[11px] text-[#505050] hover:text-white transition-colors duration-200"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 border border-[#505050] rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        onClick={() => handleSearchResultClick(result.path)}
                        className="p-3 hover:bg-[#fc00ff]/20 cursor-pointer border-b border-[#505050]/30 last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-white text-sm font-medium">
                              {result.title}
                            </h4>
                            <p className="text-gray-400 text-xs mt-1">
                              {result.description}
                            </p>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              result.type === "premium"
                                ? "bg-gradient-to-r from-[#fc00ff] to-[#00dbde] text-white"
                                : "bg-gray-700 text-gray-300"
                            }`}
                          >
                            {result.type === "premium" ? "Premium" : "Free"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* No Results Message */}
                {showSearchResults &&
                  searchResults.length === 0 &&
                  searchQuery.trim() && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 border border-[#505050] rounded-lg shadow-xl z-50 p-4 text-center">
                      <p className="text-gray-400 text-sm">
                        No features found matching "{searchQuery}"
                      </p>
                    </div>
                  )}
              </div>
            </>
          )}

          {/* Notification icons */}
          <div
            className={`flex items-center ${isMobile ? "gap-1.5" : "gap-4"}`}
          >
            <button className="text-[#505050] hover:text-white relative transition-colors flex-shrink-0">
              <BellIcon
                className={`${isMobile ? "w-4 h-4" : "w-[22px] h-[22px]"}`}
              />
              <span
                className={`absolute -top-1 -right-1 bg-red-500 rounded-full text-xs flex items-center justify-center text-white ${
                  isMobile ? "w-2.5 h-2.5 text-[10px]" : "w-3 h-3"
                }`}
              >
                3
              </span>
            </button>
            {!isMobile && <div className="h-7 w-px bg-[#505050]" />}
            <div className="relative z-[100]" ref={userDropdownRef}>
              <UserAvatar
                size={isMobile ? "sm" : "md"}
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              />

              {/* User Dropdown Menu */}
              {showUserDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: isMobile ? "45px" : "50px",
                    right: "0",
                    background:
                      "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(252, 0, 255, 0.2)",
                    borderRadius: "16px",
                    minWidth: isMobile ? "260px" : "280px",
                    boxShadow:
                      "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(252, 0, 255, 0.1)",
                    zIndex: 9999,
                    overflow: "hidden",
                  }}
                >
                  {/* User Info Section with enhanced styling */}
                  <div
                    className={`${
                      isMobile ? "p-4" : "p-5"
                    } border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex items-center justify-center">
                        {userProfile?.photoURL ? (
                          <img
                            className={`rounded-full object-cover border-2 border-[#fc00ff]/30 ${
                              isMobile ? "w-10 h-10" : "w-12 h-12"
                            }`}
                            alt="User Avatar"
                            src={userProfile.photoURL}
                          />
                        ) : (
                          <User
                            className={`rounded-full bg-gray-800 border-2 border-[#fc00ff]/30 text-[#fc00ff] ${
                              isMobile ? "w-10 h-10 p-2" : "w-12 h-12 p-3"
                            }`}
                            aria-label="User Icon"
                          />
                        )}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`text-white font-semibold truncate ${
                            isMobile ? "text-sm" : "text-base"
                          }`}
                        >
                          {userLoading ? (
                            <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
                          ) : (
                            getDisplayName(userProfile)
                          )}
                        </h4>
                        <p
                          className={`text-gray-400 truncate ${
                            isMobile ? "text-xs" : "text-sm"
                          }`}
                        >
                          {userLoading ? (
                            <div className="h-3 bg-gray-600 rounded animate-pulse w-3/4"></div>
                          ) : (
                            userProfile?.email || "user@example.com"
                          )}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-400">Online</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className={`${isMobile ? "py-2" : "py-3"}`}>
                    {/* Profile */}
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        window.location.href = "/settings#profileSettings";
                      }}
                      className={`w-full flex items-center gap-3 text-white hover:bg-gradient-to-r hover:from-gray-800/80 hover:to-gray-700/80 transition-all duration-200 text-left ${
                        isMobile ? "px-4 py-3" : "px-5 py-3"
                      } group`}
                    >
                      <User className="w-4 h-4 text-[#fc00ff] group-hover:scale-110 transition-transform" />
                      <span
                        className={`${
                          isMobile ? "text-sm" : "text-sm"
                        } font-medium`}
                      >
                        Profile Settings
                      </span>
                    </button>

                    {/* Billing */}
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        window.location.href = "/billing";
                      }}
                      className={`w-full flex items-center gap-3 text-white hover:bg-gradient-to-r hover:from-gray-800/80 hover:to-gray-700/80 transition-all duration-200 text-left ${
                        isMobile ? "px-4 py-3" : "px-5 py-3"
                      } group`}
                    >
                      <CreditCard className="w-4 h-4 text-[#fc00ff] group-hover:scale-110 transition-transform" />
                      <span
                        className={`${
                          isMobile ? "text-sm" : "text-sm"
                        } font-medium`}
                      >
                        Billing & Plans
                      </span>
                      <span
                        className={`ml-auto bg-gradient-to-r from-[#fc00ff] to-[#00dbde] bg-clip-text text-transparent font-semibold ${
                          isMobile ? "text-xs" : "text-xs"
                        } px-2 py-1 bg-gray-800/50 rounded-full`}
                      >
                        Pro
                      </span>
                    </button>

                    {/* Privacy */}
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        window.location.href = "/settings#privacy&security";
                      }}
                      className={`w-full flex items-center gap-3 text-white hover:bg-gradient-to-r hover:from-gray-800/80 hover:to-gray-700/80 transition-all duration-200 text-left ${
                        isMobile ? "px-4 py-3" : "px-5 py-3"
                      } group`}
                    >
                      <Shield className="w-4 h-4 text-[#fc00ff] group-hover:scale-110 transition-transform" />
                      <span
                        className={`${
                          isMobile ? "text-sm" : "text-sm"
                        } font-medium`}
                      >
                        Privacy & Security
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        window.location.href = "/help";
                      }}
                      className={`w-full flex items-center gap-3 text-white hover:bg-gradient-to-r hover:from-gray-800/80 hover:to-gray-700/80 transition-all duration-200 text-left ${
                        isMobile ? "px-4 py-3" : "px-5 py-3"
                      } group`}
                    >
                      <HelpCircleIcon className="w-4 h-4 text-[#fc00ff] group-hover:scale-110 transition-transform" />
                      <span
                        className={`${
                          isMobile ? "text-sm" : "text-sm"
                        } font-medium`}
                      >
                        Help & Support
                      </span>
                    </button>

                    <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent my-2 mx-4" />

                    {/* Sound Settings
                    <button
                      onClick={() => {
                        setNotificationSound(!notificationSound);
                      }}
                      className={`w-full flex items-center gap-3 text-white hover:bg-gradient-to-r hover:from-gray-800/80 hover:to-gray-700/80 transition-all duration-200 text-left ${
                        isMobile ? "px-4 py-3" : "px-5 py-3"
                      } group`}
                    >
                      <Volume2 className="w-4 h-4 text-[#fc00ff] group-hover:scale-110 transition-transform" />
                      <span
                        className={`${
                          isMobile ? "text-sm" : "text-sm"
                        } font-medium`}
                      >
                        Notification Sounds
                      </span>
                      <div className="ml-auto">
                        <div
                          className={`rounded-full transition-all duration-300 ${
                            isMobile ? "w-8 h-4" : "w-10 h-5"
                          } ${
                            notificationSound
                              ? "bg-gradient-to-r from-[#fc00ff] to-[#00dbde]"
                              : "bg-gray-600"
                          } relative`}
                        >
                          <div
                            className={`bg-white rounded-full transition-transform duration-300 absolute top-0.5 ${
                              isMobile ? "w-3 h-3" : "w-4 h-4"
                            } ${
                              notificationSound
                                ? isMobile
                                  ? "translate-x-4"
                                  : "translate-x-5"
                                : "translate-x-0.5"
                            }`}
                          />
                        </div>
                      </div>
                    </button>

                    <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent my-2 mx-4" /> */}

                    {/* Logout */}
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        auth.signOut();
                      }}
                      className={`w-full flex items-center gap-3 text-red-400 hover:bg-gradient-to-r hover:from-red-900/50 hover:to-red-800/50 transition-all duration-200 text-left ${
                        isMobile ? "px-4 py-3" : "px-5 py-3"
                      } group`}
                    >
                      <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span
                        className={`${
                          isMobile ? "text-sm" : "text-sm"
                        } font-medium`}
                      >
                        Sign Out
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

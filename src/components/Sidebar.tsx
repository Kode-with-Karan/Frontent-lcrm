import React from "react";
import { useNavigate } from "react-router-dom";
import { useMobile } from "../context/MobileContext";
import UserAvatar from "./UserAvatar";
import {
  ChevronDownIcon,
  PlusIcon,
  HomeIcon,
  CalendarIcon,
  // NotebookIcon,
  InboxIcon,
  UsersIcon,
  CrownIcon,
  VideoIcon,
  SearchIcon,
  MicIcon,
  // BrainIcon,
  FileTextIcon,
  SettingsIcon,
  HelpCircleIcon,
  LinkedinIcon,
  SparklesIcon,
  CopyIcon,
  Zap,
  X,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const [activeNavItem, setActiveNavItem] = React.useState("Home");

  // Navigation items with proper icons
  const navItems = [
    {
      title: "Home",
      icon: HomeIcon,
      subtitle: null,
      hasAddButton: false,
      path: "/dashboard",
    },
    // {
    //   title: "Team Management",
    //   icon: UsersIcon,
    //   subtitle: "(Up to 5 users)",
    //   hasAddButton: true,
    //   path: "/multi-profile-management",
    // },
  ];

  // Main dashboard features
  const dashboardFeatures = [
    { title: "YouTube to Post", path: "/youtube-converter", icon: VideoIcon },
    { title: "Viral Posts", path: "/viral-search", icon: SearchIcon },
    { title: "Create a Post", path: "/create-post", icon: FileTextIcon },
    {
      title: "7 Days Calendar Automation",
      path: "/calendar-automation",
      icon: CalendarIcon,
    },
  ];

  // Premium features
  const premiumFeatures = [
    {
      title: "Role-Based Content",
      path: "/role-personalization",
      icon: UsersIcon,
    },
    { title: "Voice to Post", path: "/voice-to-post", icon: MicIcon },
    {
      title: "LinkedIn Profile",
      path: "/profile-analyzer",
      icon: LinkedinIcon,
    },
    { title: "Reference Cloning", path: "/reference-cloning", icon: CopyIcon },
    {
      title: "Full Calendar Automation",
      path: "/calendar-automation",
      icon: CalendarIcon,
    },
    {
      title: "Inbox Delivery",
      path: "/inbox-delivery",
      icon: InboxIcon,
    },
    {
      title: "Strategic Goals",
      path: "/goal-based-content",
      icon: SparklesIcon,
    },
    { title: "Notes Sync", path: "/notes-sync", icon: FileTextIcon },
    {
      title: "Reddit Post Cloning",
      path: "/reddit-post-cloning",
      icon: Zap,
    },
    // { title: "LinkedIn CRM Chat", path: "/klype-chat", icon: SparklesIcon },
  ];

  // Quick actions
  const quickActions = [
    {
      title: "Settings",
      path: "/settings",
      icon: SettingsIcon,
    },
    { title: "Billing & Plans", path: "/billing", icon: Zap },
    { title: "Help & Support", path: "/help", icon: HelpCircleIcon },
  ];

  const { isMobile, isSidebarOpen, setSidebarOpen } = useMobile();

  const handleNavigation = (path: string) => {
    if (path && path !== "#") {
      navigate(path);
      // Close sidebar on mobile after navigation
      if (isMobile) {
        setSidebarOpen(false);
      }
    }
  };

  // Close sidebar when clicking outside on mobile
  const handleBackdropClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Handle escape key to close sidebar on mobile
  React.useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMobile && isSidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isMobile, isSidebarOpen, setSidebarOpen]);

  // Prevent body scroll when mobile sidebar is open
  React.useEffect(() => {
    if (isMobile && isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobile, isSidebarOpen]);

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={handleBackdropClick}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed w-64 h-screen top-0 left-0 z-50 backdrop-blur-md border-r border-gray-700/30 shadow-2xl transition-transform duration-300 ease-in-out ${
          isMobile
            ? isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        } lg:translate-x-0`}
        style={{
          // Improve touch scrolling on mobile
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-y",
        }}
      >
        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 p-2 bg-gray-800/80 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 lg:hidden z-10"
            title="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Subtle transparent overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/10 pointer-events-none" />

        {/* Logo and User Profile */}
        <div className="px-4 mt-6">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-2xl font-bold text-white tracking-wide">
              LinkedIn CRM
            </h1>
          </div>

          {/* User Profile Card with consistent styling */}
          <div
            className="flex items-center cursor-pointer p-3 rounded-xl transition-all duration-300 
          bg-gradient-to-r from-black/50 via-gray-900/30 to-black/50 
          border border-gray-500/40 shadow-lg shadow-gray-800/30"
          >
            <UserAvatar
              size="lg"
              showName={true}
              showTitle={true}
              className="flex-1"
            />
            <button className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-500/30 transition-all duration-300">
              <ChevronDownIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Premium Separator with glow effect */}
        <div className="w-full flex justify-center mt-6 mb-4 relative">
          <div className="w-[140px] h-px bg-gradient-to-r from-transparent via-gray-400/60 to-transparent relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/30 to-transparent blur-sm"></div>
          </div>
        </div>

        {/* Navigation with enhanced styling and improved custom scrollbar */}
        <nav
          className="mt-6 px-4 h-[calc(100vh-220px)] overflow-y-auto overflow-x-hidden relative scroll-smooth"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(75, 85, 99, 0.4) rgba(17, 24, 39, 0.2)",
          }}
        >
          {/* Enhanced custom scrollbar styles */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
            nav {
              scroll-behavior: smooth;
            }
            nav::-webkit-scrollbar {
              width: 8px;
            }
            nav::-webkit-scrollbar-track {
              background: rgba(17, 24, 39, 0.3);
              border-radius: 4px;
              margin: 4px 0;
            }
            nav::-webkit-scrollbar-thumb {
              background: linear-gradient(180deg, rgba(75, 85, 99, 0.6) 0%, rgba(55, 65, 81, 0.6) 100%);
              border-radius: 4px;
              border: 1px solid rgba(75, 85, 99, 0.2);
              transition: all 0.3s ease;
            }
            nav::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(180deg, rgba(75, 85, 99, 0.8) 0%, rgba(55, 65, 81, 0.8) 100%);
              box-shadow: 0 0 6px rgba(75, 85, 99, 0.3);
            }
            nav::-webkit-scrollbar-thumb:active {
              background: linear-gradient(180deg, rgba(96, 165, 250, 0.8) 0%, rgba(147, 51, 234, 0.8) 100%);
            }
            nav::-webkit-scrollbar-corner {
              background: transparent;
            }
            /* Hide scrollbar on Firefox when not hovering */
            nav {
              scrollbar-width: thin;
              scrollbar-color: rgba(75, 85, 99, 0.4) transparent;
            }
            nav:hover {
              scrollbar-color: rgba(75, 85, 99, 0.6) rgba(17, 24, 39, 0.3);
            }
          `,
            }}
          />
          <ul className="space-y-3">
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = activeNavItem === item.title;
              const isHome = item.title === "Home";
              return (
                <li
                  key={index}
                  className={`relative group ${
                    isActive ? "scale-[1.02]" : ""
                  } transition-all duration-300 ${isHome ? "mt-2 mb-2" : ""}`}
                  onClick={() => {
                    setActiveNavItem(item.title);
                    handleNavigation(item.path);
                  }}
                >
                  {/* Active indicator */}
                  {isActive && !isHome && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-white to-gray-400 rounded-r-full shadow-lg shadow-white/30"></div>
                  )}

                  <div
                    className={`flex items-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
                      isHome
                        ? isMobile
                          ? "p-5 mx-2 min-h-[56px]"
                          : "p-4 mx-2 min-h-[48px]"
                        : isMobile
                        ? "p-4 mx-2"
                        : "p-3 mx-2"
                    } rounded-xl ${
                      isActive && !isHome
                        ? "bg-gradient-to-r from-black/50 via-gray-900/30 to-black/50 border border-gray-500/40 shadow-lg shadow-gray-800/30"
                        : isHome
                        ? "bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600 shadow-md text-white"
                        : "hover:bg-gradient-to-r hover:from-black/30 hover:to-gray-900/20 border border-transparent hover:border-gray-600/20"
                    }`}
                  >
                    {/* Background glow for active items */}
                    {isActive && !isHome && (
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-600/5 via-transparent to-gray-600/5 animate-pulse"></div>
                    )}

                    <div
                      className={`relative z-10 p-1 rounded-lg ${
                        isActive && !isHome
                          ? "bg-gray-500/20"
                          : isHome
                          ? "bg-gray-800"
                          : "group-hover:bg-gray-700/20"
                      } transition-all duration-300`}
                    >
                      <IconComponent
                        className={`w-[20px] h-[20px] transition-all duration-300 ${
                          isActive && !isHome
                            ? "text-white drop-shadow-lg"
                            : isHome
                            ? "text-white"
                            : "text-gray-400 group-hover:text-gray-200"
                        }`}
                      />
                    </div>

                    <div className="ml-4 flex-1 relative z-10">
                      <div
                        className={`font-medium text-[14px] transition-all duration-300 ${
                          isActive && !isHome
                            ? "text-white font-semibold"
                            : isHome
                            ? "text-white font-semibold"
                            : "text-gray-300 group-hover:text-white"
                        }`}
                      >
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className="font-normal text-gray-500 text-[11px] mt-0.5 group-hover:text-gray-400 transition-colors">
                          {item.subtitle}
                        </div>
                      )}
                    </div>

                    {item.hasAddButton && (
                      <button
                        className={`ml-auto p-1.5 rounded-lg transition-all duration-300 ${
                          isActive
                            ? "text-white hover:text-gray-200 hover:bg-gray-500/30"
                            : "text-gray-500 hover:text-white hover:bg-gray-600/50"
                        }`}
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    )}

                    {/* Premium indicator for certain items */}
                    {(item.title === "Team Management" ||
                      item.title === "Inbox management") && (
                      <div className="absolute top-1 right-1">
                        <CrownIcon className="w-3 h-3 text-yellow-500" />
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Dashboard Features Section */}
          <div className="mt-8 mb-4">
            <div className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-3 px-2">
              Featured Tools
            </div>
            <div className="grid grid-cols-1 gap-2">
              {dashboardFeatures.map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleNavigation(feature.path)}
                    className={`flex items-center transition-all duration-300 group relative rounded-lg ${
                      isMobile ? "p-4" : "p-3"
                    } bg-gradient-to-br from-black/40 to-gray-900/30 border border-gray-600/30 hover:border-gray-500/50`}
                  >
                    <div className="p-1 rounded-lg bg-gray-500/20 group-hover:bg-gray-500/30 transition-all duration-300">
                      <FeatureIcon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                    <div className="ml-3 text-left">
                      <div className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">
                        {feature.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Premium Features Section */}
          <div className="mt-6 mb-6">
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="text-xs uppercase tracking-widest text-gray-500 font-bold">
                Premium
              </div>
              <CrownIcon className="w-3 h-3 text-yellow-500" />
            </div>
            <div className="grid grid-cols-1 gap-2">
              {premiumFeatures.map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleNavigation(feature.path)}
                    className={`flex items-center transition-all duration-300 group relative rounded-lg ${
                      isMobile ? "p-4" : "p-3"
                    } bg-gradient-to-br from-gray-800 to-black border border-gray-600 hover:border-gray-400`}
                  >
                    {/* Premium subtle glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-700/10 to-gray-900/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="p-1 rounded-lg bg-gray-700/20 group-hover:bg-gray-700/30 transition-all duration-300 relative z-10">
                      <FeatureIcon className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
                    </div>
                    <div className="ml-3 text-left relative z-10">
                      <div className="text-sm text-gray-200 group-hover:text-white transition-colors font-medium">
                        {feature.title}
                      </div>
                    </div>
                    <CrownIcon className="w-3 h-3 text-gray-400 ml-auto relative z-10" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="mt-6 mb-4">
            <div className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-3 px-2">
              Quick Actions
            </div>
            <div className="grid grid-cols-1 gap-2">
              {quickActions.map((action, index) => {
                const ActionIcon = action.icon;
                const isUpgrade = action.title === "Upgrade to Pro";
                return (
                  <button
                    key={index}
                    onClick={() => handleNavigation(action.path)}
                    className={`flex items-center transition-all duration-300 group relative rounded-lg ${
                      isMobile ? "p-4" : "p-3"
                    } ${
                      isUpgrade
                        ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-400/50"
                        : "bg-gradient-to-br from-black/40 to-gray-900/30 border border-gray-600/30 hover:border-gray-500/50"
                    }`}
                  >
                    {/* Upgrade glow effect */}
                    {isUpgrade && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}

                    <div
                      className={`p-1 rounded-lg transition-all duration-300 relative z-10 ${
                        isUpgrade
                          ? "bg-purple-500/20 group-hover:bg-purple-500/30"
                          : "bg-gray-500/20 group-hover:bg-gray-500/30"
                      }`}
                    >
                      <ActionIcon
                        className={`w-4 h-4 transition-colors ${
                          isUpgrade
                            ? "text-purple-400 group-hover:text-purple-300"
                            : "text-gray-400 group-hover:text-white"
                        }`}
                      />
                    </div>
                    <div className="ml-3 text-left relative z-10">
                      <div
                        className={`text-sm transition-colors font-medium ${
                          isUpgrade
                            ? "text-purple-200 group-hover:text-purple-100"
                            : "text-gray-300 group-hover:text-white"
                        }`}
                      >
                        {action.title}
                      </div>
                    </div>
                    {isUpgrade && (
                      <Zap className="w-3 h-3 text-purple-400 ml-auto relative z-10" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}

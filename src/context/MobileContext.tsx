import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * Mobile Context for handling responsive sidebar behavior
 *
 * Features:
 * - Detects mobile screen sizes (< 1024px)
 * - Manages sidebar open/closed state for mobile
 * - Automatically closes sidebar when switching to desktop
 * - Provides toggle functionality for hamburger menu
 *
 * Usage:
 * const { isMobile, isSidebarOpen, setSidebarOpen, toggleSidebar } = useMobile();
 */

interface MobileContextType {
  isMobile: boolean;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const MobileContext = createContext<MobileContextType | undefined>(undefined);

export const useMobile = () => {
  const context = useContext(MobileContext);
  if (!context) {
    throw new Error("useMobile must be used within a MobileProvider");
  }
  return context;
};

interface MobileProviderProps {
  children: React.ReactNode;
}

export const MobileProvider: React.FC<MobileProviderProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Close sidebar when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  const setSidebarOpen = (open: boolean) => {
    setIsSidebarOpen(open);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <MobileContext.Provider
      value={{
        isMobile,
        isSidebarOpen,
        setSidebarOpen,
        toggleSidebar,
      }}
    >
      {children}
    </MobileContext.Provider>
  );
};

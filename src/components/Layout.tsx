import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useMobile } from "../context/MobileContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [scrollY, setScrollY] = useState(0);
  const { isMobile } = useMobile();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full min-h-screen bg-black relative">
      <div className="relative min-h-screen">
        {/* Sidebar */}
        <Sidebar />
        {/* Main Content */}
        <main
          className={`min-h-screen bg-black relative p-4 transition-all duration-300 ${
            isMobile ? "ml-0" : "ml-64"
          } lg:ml-64`}
        >
          {/* Rounded container for dashboard content */}
          <div className="relative w-full min-h-[calc(100vh-2rem)] rounded-[20px] border border-[#333333] bg-black/20 backdrop-blur-sm overflow-hidden">
            {/* Background glow effect - centers based on scroll position */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#fc00ff1f] rounded-[500px/250px] blur-[120px] pointer-events-none z-0"
              style={{
                top: `${50 + scrollY * 0.1}vh`,
                transform: "translateX(-50%) translateY(-50%)",
              }}
            />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

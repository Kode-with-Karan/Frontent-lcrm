import React from "react";
import { useNavigate } from "react-router-dom";
import { Flame, Clock, Crown } from "lucide-react";

interface MainFeatureCardProps {
  type: "main";
  title: string;
  description: string;
  image?: string;
  path: string;
  iconComponent?: React.ReactNode;
  isHot?: boolean;
  isPro?: boolean;
  isCrown?: boolean;
  time?: string;
  searchQuery?: string;
}

interface PremiumFeatureCardProps {
  type: "premium";
  title: string;
  description: string;
  icon: string;
  gradient?: boolean;
  comingSoon?: boolean;
  path: string;
  isHot?: boolean;
  isPro?: boolean;
  isCrown?: boolean;
  time?: string;
  searchQuery?: string;
}

type FeatureCardProps = MainFeatureCardProps | PremiumFeatureCardProps;

const FeatureCard: React.FC<FeatureCardProps> = (props) => {
  const navigate = useNavigate();

  // Function to highlight search terms
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span
          key={index}
          className="bg-[#fc00ff] bg-opacity-30 text-[#fc00ff] font-semibold rounded px-1"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleClick = () => {
    if (props.path && props.path !== "#") {
      navigate(props.path);
    }
  };

  // Center and shrink image without changing aspect ratio
  const imageStyle = "max-w-[220px] w-full h-auto mx-auto block";

  // Tag rendering
  const renderTopRightTag = () => {
    // Render the outside tag (Most Popular, Hot) with pro-style gradient
    if (props.isCrown) {
      return (
        <span className="absolute -top-2 -right-2 z-30 bg-gradient-to-r from-[#fc00ff] to-[#00dbde] text-white text-[10px] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 shadow whitespace-nowrap border border-[#fff3] min-h-[22px] min-w-[60px]">
          Most Popular
        </span>
      );
    }
    if (props.isHot) {
      return (
        <span className="absolute -top-2 -right-2 z-30 bg-gradient-to-r from-[#ff512f] to-[#ff8c00] text-white text-[10px] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 shadow whitespace-nowrap border border-[#fff3] min-h-[22px] min-w-[36px]">
          <Flame className="w-3 h-3 mr-1" /> Hot
        </span>
      );
    }
    return null;
  };

  // Premium crown and (optional) clock icon (inside card, top-right)
  const renderPremiumCrownIcon = () => {
    // Only show clock for Klype Chat feature
    if (props.type === "premium") {
      const isKlypeChat =
        props.title && props.title.toLowerCase().includes("klype chat");
      return (
        <span className="absolute top-6 right-2 z-20 flex items-center justify-center gap-1">
          {isKlypeChat && <Clock className="w-4 h-4 text-[#bdbdbd]" />}
          <Crown className="w-4 h-4 text-[#ffd700]" />
        </span>
      );
    }
    return null;
  };

  const renderBottomLeftTime = () => {
    if (!props.time) return null;
    return (
      <div className="absolute left-2 bottom-2 z-20 w-fit">
        <span className="bg-[#222] text-gray-200 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5 shadow whitespace-nowrap opacity-40">
          <Clock className="w-3 h-3 mr-0.5 opacity-30" />
          {props.time}
        </span>
      </div>
    );
  };

  if (props.type === "main") {
    return (
      <div className="group relative">
        {/* Holographic hover effect with light line */}
        <div className="pointer-events-none absolute inset-0 z-0 rounded-[15px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 before:content-[''] before:absolute before:inset-0 before:rounded-[15px] before:bg-[linear-gradient(180deg,_transparent_0%,_#fc00ff_20%,_#fff_50%,_#00dbde_80%,_transparent_100%)] before:blur-[16px] before:opacity-10 before:animate-holo-slide-btt" />
        <div
          className="w-full max-w-[300px] min-h-[220px] bg-[#4646461c] rounded-[15px] border border-solid border-[#ffffff1a] hover:border-[#fc00ff40] transition-all duration-300 cursor-pointer mx-auto relative flex flex-col justify-between z-10"
          onClick={handleClick}
        >
          {renderTopRightTag()}
          <div className="p-0 flex-1 flex flex-col">
            <div className="text-center pt-[18px] px-[26px]">
              <h3 className="font-medium text-white text-[15px] group-hover:text-[#fc00ff] transition-colors">
                {props.searchQuery
                  ? highlightText(props.title, props.searchQuery)
                  : props.title}
              </h3>
            </div>
            <div className="relative mt-[-18px] flex justify-center items-center flex-1">
              {props.iconComponent ? (
                <div className="relative z-10 flex justify-center items-center w-[180px] h-[60px] max-w-full max-h-[60px] overflow-hidden">
                  {props.iconComponent}
                </div>
              ) : props.image ? (
                <img
                  className={`relative z-10 group-hover:scale-110 transition-transform duration-300 ${imageStyle}`}
                  alt="Feature"
                  src={props.image}
                />
              ) : null}
            </div>
            {renderBottomLeftTime()}
          </div>
        </div>
      </div>
    );
  }

  if (props.type === "premium") {
    return (
      <div className="group relative">
        {/* Holographic hover effect with light line */}
        <div className="pointer-events-none absolute inset-0 z-0 rounded-[15px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 before:content-[''] before:absolute before:inset-0 before:rounded-[15px] before:bg-[linear-gradient(180deg,_transparent_0%,_#fc00ff_20%,_#fff_50%,_#00dbde_80%,_transparent_100%)] before:blur-[16px] before:opacity-10 before:animate-holo-slide-btt" />
        <div
          className={`w-full max-w-[300px] min-h-[220px] rounded-[15px] border border-solid border-[#6c6c6c1a] hover:border-[#fc00ff40] transition-all duration-300 cursor-pointer mx-auto backdrop-blur-xl relative flex flex-col justify-between z-10 ${
            props.gradient
              ? "bg-[linear-gradient(90deg,_rgba(37,37,37,0.2)_0%,_rgba(0,0,0,0.5)_100%)]"
              : "bg-[#4646461c]"
          }`}
          onClick={handleClick}
        >
          {renderTopRightTag()}
          {renderPremiumCrownIcon()}
          <div className="p-0 flex flex-col flex-1 items-center relative">
            <img
              className="w-[30px] h-[30px] mt-7 object-cover group-hover:scale-110 transition-transform duration-300"
              alt={props.title}
              src={props.icon}
            />
            <h3 className="font-medium text-white text-[15px] text-center mt-[10px] px-5 group-hover:text-[#fc00ff] transition-colors">
              {props.searchQuery
                ? highlightText(props.title, props.searchQuery)
                : props.title}
            </h3>
            <p className="font-bold text-[#858585] text-[13px] text-center mt-3 px-5">
              {props.searchQuery
                ? highlightText(props.description, props.searchQuery)
                : props.description}
            </p>
          </div>
          {renderBottomLeftTime()}
          {props.comingSoon && (
            <div className="absolute left-1/2 bottom-2 transform -translate-x-1/2 z-30 rounded-[100px] border border-solid border-[#858585] bg-transparent px-3 py-1 flex justify-center items-center">
              <span className="text-[#8e8e8e] text-[10px]">Coming soon</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default FeatureCard;

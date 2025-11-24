import React from "react";

interface CrossingVectorsProps {
  className?: string;
}

const CrossingVectors: React.FC<CrossingVectorsProps> = ({
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        width="240"
        height="90"
        viewBox="0 0 240 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <defs>
          <filter
            id="filter0_d_1669_1498"
            x="0"
            y="0.5"
            width="240"
            height="90"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.833654 0 0 0 0 0.153104 0 0 0 0 0.153104 0 0 0 0.5 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1669_1498"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1669_1498"
              result="shape"
            />
          </filter>

          <filter
            id="filter0_d_1669_1504"
            x="0"
            y="0.8125"
            width="240"
            height="85.1494"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.833654 0 0 0 0 0.153104 0 0 0 0 0.153104 0 0 0 0.5 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1669_1504"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1669_1504"
              result="shape"
            />
          </filter>
        </defs>

        {/* First Vector - Original Vector.svg path */}
        <g filter="url(#filter0_d_1669_1498)">
          <path
            d="M4 10H34.7538C45.7086 10 56.4543 12.9992 65.8257 18.6723L167.674 80.3277C177.046 86.0008 187.791 89 198.746 89H228"
            stroke="#5E003D"
            strokeWidth="1"
            fill="none"
            opacity="0.8"
          />
        </g>

        {/* Second Vector - Original Vector (1).svg path (crossing) */}
        <g filter="url(#filter0_d_1669_1504)">
          <path
            d="M229.688 10.7207L198.811 10.3172C187.938 10.1751 177.216 12.9904 167.793 18.4619L64.7134 78.3123C55.2898 83.7838 44.5685 86.599 33.6955 86.4569L4.31737 86.0731"
            stroke="#5E003D"
            strokeWidth="1"
            fill="none"
            opacity="0.7"
          />
        </g>
      </svg>
    </div>
  );
};

export default CrossingVectors;

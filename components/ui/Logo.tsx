import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 80, className = "" }) => (
  <svg
    width={size}
    height={(size * 72) / 120}
    viewBox="0 0 120 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: "block", margin: "0 auto" }}
  >
    {/* Folha estilizada, centralizada */}
    <g>
      <ellipse
        cx="60"
        cy="28"
        rx="34"
        ry="18"
        fill="#34d399"
        stroke="#059669"
        strokeWidth="3"
        transform="rotate(-15 60 28)"
      />
      <path
        d="M60 44 Q80 20 108 16"
        stroke="#059669"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M60 44 Q40 20 12 24"
        stroke="#059669"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
    </g>
    {/* Texto Flora Finance, centralizado */}
    <text
      x="60"
      y="64"
      textAnchor="middle"
      fontFamily="Inter, Arial, sans-serif"
      fontWeight="bold"
      fontSize="18"
      fill="#222"
      letterSpacing="0.5"
      style={{ dominantBaseline: "middle" }}
    >
      Flora Finance
    </text>
  </svg>
);

export default Logo;

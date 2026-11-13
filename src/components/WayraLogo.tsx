import React from 'react';

interface WayraLogoProps {
  className?: string;
}

export const WayraLogo: React.FC<WayraLogoProps> = ({ className = 'w-11 h-11' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Logo Wayra Experience"
    >
      <rect width="64" height="64" rx="18" fill="#2D4F3E" />
      <path
        d="M12 43L25 22L34 34L42 25L52 43H12Z"
        fill="#5A8259"
        stroke="#F8F7F2"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M16 24C21 19 28 19 33 23C36 25.5 41 25.5 45 22"
        stroke="#E5A93C"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        d="M21 17C25 14 31 14 35 16.5"
        stroke="#F8F7F2"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />
      <circle cx="48" cy="17" r="3.5" fill="#E5A93C" />
    </svg>
  );
};

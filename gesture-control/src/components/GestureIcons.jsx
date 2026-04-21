import React from 'react';

// Custom SVG hand-gesture icons — stroke-based to match Lucide aesthetic.
// Each icon represents the actual hand pose that MediaPipe detects.

const iconProps = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };

export const ThumbUpIcon = ({ size = 24, className = '', strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth} className={className} {...iconProps}>
    {/* Thumb pointing up */}
    <path d="M7 10h2V20H7a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z" />
    <path d="M11 10l2.5-6a1.5 1.5 0 0 1 2.8.7v3.3H19a2 2 0 0 1 1.9 2.6l-1.5 5A2 2 0 0 1 17.5 17H11V10z" />
  </svg>
);

export const ThumbDownIcon = ({ size = 24, className = '', strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth} className={className} {...iconProps}>
    {/* Thumb pointing down */}
    <path d="M17 14h-2V4h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1z" />
    <path d="M13 14l-2.5 6a1.5 1.5 0 0 1-2.8-.7v-3.3H5a2 2 0 0 1-1.9-2.6l1.5-5A2 2 0 0 1 6.5 7H13v7z" />
  </svg>
);

export const OpenPalmIcon = ({ size = 24, className = '', strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth} className={className} {...iconProps}>
    {/* Open hand / palm */}
    <path d="M8 13V6.5a1.5 1.5 0 0 1 3 0V11" />
    <path d="M11 11V5a1.5 1.5 0 0 1 3 0v6" />
    <path d="M14 10.5a1.5 1.5 0 0 1 3 0V13" />
    <path d="M17 13a1.5 1.5 0 0 1 3 0v2A7 7 0 0 1 10 22H8a6 6 0 0 1-6-6v-1a1.5 1.5 0 0 1 3 0" />
    <path d="M5 15V9a1.5 1.5 0 0 1 3 0v4" />
  </svg>
);

export const ClosedFistIcon = ({ size = 24, className = '', strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth} className={className} {...iconProps}>
    {/* Closed fist */}
    <rect x="5" y="10" width="14" height="8" rx="2" />
    <path d="M8 10V8a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
    <path d="M7 18v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-2" />
    <path d="M5 14h2" />
    <path d="M17 14h2" />
  </svg>
);

export const PointingUpIcon = ({ size = 24, className = '', strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth} className={className} {...iconProps}>
    {/* Index finger pointing up */}
    <path d="M10 3.5a2 2 0 0 1 4 0v7" />
    <path d="M8 12V9.5a2 2 0 1 1 4 0" />
    <path d="M14 11.5V10a2 2 0 0 1 4 0v3" />
    <path d="M18 13a2 2 0 0 1 2 2v1A8 8 0 0 1 12 24h0A8 8 0 0 1 4 16v-2a2 2 0 0 1 4 0" />
  </svg>
);

export const VictoryIcon = ({ size = 24, className = '', strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth} className={className} {...iconProps}>
    {/* Victory / Peace — index and middle finger extended in V */}
    {/* Index finger */}
    <path d="M9 12V5a1.5 1.5 0 0 1 3 0v7" />
    {/* Middle finger */}
    <path d="M12 12V4a1.5 1.5 0 0 1 3 0v8" />
    {/* Ring and pinky curled + palm */}
    <path d="M15 12.5a2 2 0 0 1 2 2V16a6 6 0 0 1-6 6h-1a5 5 0 0 1-5-5v-1a2 2 0 0 1 4 0" />
    {/* Thumb tucked */}
    <path d="M9 12.5a2 2 0 0 0-2 2" />
  </svg>
);

export const ILoveYouIcon = ({ size = 24, className = '', strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth} className={className} {...iconProps}>
    {/* ILY — pinky up, index up, thumb out; ring & middle finger curled */}
    {/* Pinky finger */}
    <path d="M6 13V6a1.5 1.5 0 0 1 3 0v5" />
    {/* Index finger */}
    <path d="M13 13V5a1.5 1.5 0 0 1 3 0v8" />
    {/* Thumb extended */}
    <path d="M6 11.5l-2-1a1.5 1.5 0 0 1 1.5-2.6l2 1" />
    {/* Middle + ring curled, palm base */}
    <path d="M9 13.5a2 2 0 0 1 2 2v.5A5 5 0 0 1 6 21H5a3 3 0 0 1-3-3v-1a2 2 0 0 1 4 0" />
    <path d="M16 13.5a2 2 0 0 1 2 2v1a3 3 0 0 1-3 3" />
  </svg>
);

export const NoneIcon = ({ size = 24, className = '', strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth} className={className} {...iconProps}>
    <circle cx="12" cy="12" r="9" strokeDasharray="4 2" />
    <path d="M9 9l6 6M15 9l-6 6" />
  </svg>
);

// ── Export a unified map for easy lookup ──────────────────────────────────────
export const GESTURE_ICON_MAP = {
  None:         NoneIcon,
  Closed_Fist:  ClosedFistIcon,
  Open_Palm:    OpenPalmIcon,
  Pointing_Up:  PointingUpIcon,
  Thumb_Down:   ThumbDownIcon,
  Thumb_Up:     ThumbUpIcon,
  Victory:      VictoryIcon,
  ILoveYou:     ILoveYouIcon,
};

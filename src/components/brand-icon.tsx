interface BrandIconProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

const sizeMap = {
  sm: "h-5 w-5",
  md: "h-7 w-7",
  lg: "h-9 w-9",
  xl: "h-12 w-12",
  "2xl": "h-16 w-16",
  "3xl": "h-20 w-20"};

/** SiteBotGPT brand icon — bot head (visible face) + chat bubble. Polished for clarity at sm–3xl. */
export function BrandIcon({ className = "", size = "md" }: BrandIconProps) {
  const sizeClass = sizeMap[size];

  return (
    <svg
      className={`${sizeClass} shrink-0 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Bot head — rounded rect, stroke consistent with bubble */}
      <rect
        x="4.25"
        y="2.25"
        width="11.5"
        height="11.5"
        rx="2.75"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Antennae */}
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M7.5 2v-1.25M12.5 2v-1.25"
      />
      {/* Eyes — slightly larger for small sizes */}
      <circle cx="8.25" cy="7" r="1.15" fill="currentColor" />
      <circle cx="11.75" cy="7" r="1.15" fill="currentColor" />
      {/* Smile */}
      <path
        d="M8 10.75c.5.5 1.5.5 2 0"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
      />
      {/* Speech bubble — attached to head */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 6h4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1.5l-1.5 2-1.5-2H15a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
        fill="currentColor"
      />
    </svg>
  );
}

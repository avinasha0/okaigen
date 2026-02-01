interface BrandIconProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-5 w-5",
  md: "h-7 w-7",
  lg: "h-9 w-9",
};

/** SiteBotGPT brand icon - chat bubble with AI dot */
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
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-2.5l-2 2.5-2-2.5H7a3 3 0 0 1-3-3V6Zm12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

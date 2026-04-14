import { useId } from "react";

interface TenRentLogoProps {
  size?: number;
  mono?: boolean;
}

export default function TenRentLogo({
  size = 22,
  mono = false,
}: TenRentLogoProps) {
  const gradientId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="64" x2="64" y2="0">
          <stop stopColor={mono ? "#ffffff" : "#06b6d4"} />
          <stop offset="1" stopColor={mono ? "#ffffff" : "#38bdf8"} />
        </linearGradient>
      </defs>
      <rect
        x="32"
        y="4"
        width="24"
        height="24"
        rx="5"
        transform="rotate(45 32 4)"
        fill={`url(#${gradientId})`}
        opacity={mono ? 0.3 : 0.25}
      />
      <rect
        x="32"
        y="14"
        width="20"
        height="20"
        rx="4"
        transform="rotate(45 32 14)"
        fill={`url(#${gradientId})`}
        opacity={mono ? 0.55 : 0.5}
      />
      <rect
        x="32"
        y="24"
        width="16"
        height="16"
        rx="3"
        transform="rotate(45 32 24)"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
}

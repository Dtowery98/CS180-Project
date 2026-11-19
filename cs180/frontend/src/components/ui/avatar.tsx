// src/components/ui/avatar.tsx
type AvatarProps = {
  src?: string | null; // the photo; empty shows a placeholder
  size?: number;       // diameter in px
  alt?: string;
  className?: string;
};

export default function Avatar({ src, size = 146, alt = "Profile photo", className = "" }: AvatarProps) {
  return (
    <div
      className={`shrink-0 overflow-hidden rounded-full border border-[#D4D4D4]/30 bg-[#111] ${className}`}
      style={{ width: size, height: size }}>
        <img src={src || "/rspace-logo.svg"} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}
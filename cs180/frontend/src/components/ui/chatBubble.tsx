import type { ReactNode } from "react";
import { cn } from "@/../lib/utils";
import bubbleArtwork from "../../../public/chat-bubble.svg";

type ChatBubbleProps = {
  children: ReactNode;
  className?: string;
};

export default function ChatBubble({ children, className }: ChatBubbleProps) {
  return (
    <div className={cn("@container relative aspect-[244.43/112.632] w-56", className)}>
      <img src={bubbleArtwork.src} alt="" className="absolute inset-0 size-full" />
      <div className="absolute left-1/2 top-[42.2%] w-[78%] -translate-x-1/2 -translate-y-1/2 text-center text-[6.545cqw] leading-[1.375] text-[#121214]">
        {children}
      </div>
    </div>
  );
}

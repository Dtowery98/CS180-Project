// src/components/ui/speechBubble.tsx
"use client";

import { useEffect, useRef, useState } from "react";

type SpeechBubbleProps = {
  value?: string;                     // starting text
  onChange?: (text: string) => void;  // tells the parent what was typed
  placeholder?: string;
  maxLength?: number;                 // keep bios short
  className?: string;
};

export default function SpeechBubble({
  value = "",
  onChange,
  placeholder = "say something...",
  maxLength = 35,
  className = "",
}: SpeechBubbleProps) {
  const [text, setText] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Grow/shrink the text box to fit its text, so the bubble wraps the words
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  return (
    // relative: lets the tail be positioned against this box
    <div className={`relative w-[200px] ${className}`}>
      {/* The bubble */}
      <div className="relative rounded-[22px] bg-[#F5F5F5] px-5 py-3.5">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          maxLength={maxLength}
          placeholder={placeholder}
          aria-label="Short bio"
          onChange={(e) => {
            setText(e.target.value);
            onChange?.(e.target.value);
          }}
          className="block w-full resize-none overflow-hidden bg-transparent p-0 text-center text-xl leading-[1.1] text-[#121212] outline-none placeholder:text-[#121212]/40"
        />
        <svg
        width="24"
        height="15"
        viewBox="0 0 24 20"
        aria-hidden="true"
        className="absolute -right-1.5 top-[calc(100%-8px)]"
      >
        <path d="M0 0 H14 C14 8 17 15 24 20 C14 20 5 15 0 9 Z" fill="#F5F5F5" />
      </svg>
      </div>

      {/* Characters left, shown under the bubble */}
      <p className="mt-6 text-center text-xs text-[#F5F5F5]/75">
        {maxLength - text.length} characters left
      </p>
    </div>
  );
}
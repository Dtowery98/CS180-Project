// src/components/ui/card.tsx
"use client";

import { useState, type ReactNode } from "react";

type CardProps = {
  title: string;
  description?: string;
  media?: ReactNode;    // an image at the top, e.g. <img src="..." />
  avatar?: ReactNode;   // small picture in the footer, e.g. <Avatar size={28} />
  meta?: ReactNode;     // footer text, e.g. the person's name
  selected?: boolean;   // set this to control it from the parent
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  className?: string;
};

export default function Card({
  title,
  description,
  media,
  avatar,
  meta,
  selected: selectedProp,
  defaultSelected = false,
  onSelectedChange,
  className = "",
}: CardProps) {
  // Works on its own, or lets the parent decide if it passes `selected`
  const [internal, setInternal] = useState(defaultSelected);
  const selected = selectedProp ?? internal;

  const toggle = () => {
    const next = !selected;
    if (selectedProp === undefined) setInternal(next);
    onSelectedChange?.(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={selected}
      className={[
        // Shape and layout
        "group flex w-full max-w-xs cursor-pointer flex-col overflow-hidden rounded-2xl text-left",
        // Smooth change between looks
        "transition-all duration-200",
        // Keyboard focus ring
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4D4D4]",
        // Every card: shadow and a small lift on hover
        "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/50",
        selected
          ? // Selected: white border, full brightness
            "border-2 border-white bg-[#161616] opacity-100"
          : // Any other card: normal, invisible border keeps sizes equal
            "border-2 border-transparent bg-[#111] opacity-60 grayscale-[40%] hover:opacity-90",
        className,
      ].join(" ")}
    >
      {media ? (
        <div className="aspect-[4/3] w-full overflow-hidden bg-[#1a1a1a] [&>img]:h-full [&>img]:w-full [&>img]:object-cover">
          {media}
        </div>
      ) : null}

      <div className="flex flex-col gap-2 p-4">
        <h3 className="text-lg font-medium text-[#F5F7FA]">{title}</h3>

        {description ? (
          <p className="text-sm leading-snug text-[#D4D4D4]/70">{description}</p>
        ) : null}

        {avatar || meta ? (
          <div className="mt-2 flex items-center gap-2">
            {avatar}
            {meta ? <span className="text-sm text-[#D4D4D4]">{meta}</span> : null}
          </div>
        ) : null}
      </div>
    </button>
  );
}
"use client";

/**
 * FileUpload — circular avatar uploader with zoom, pan, rotate and crop.
 *
 * Self-contained version: no shadcn/ui, react-dropzone or lucide-react needed.
 * Requirements: React 19, TypeScript 5, Tailwind CSS v4 (default utilities only).
 *
 * Usage:
 *   import FileUpload from "@/components/shadcn-space/file-upload/file-upload-05";
 *   <FileUpload />
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import SlimeOrb from "./blob";
import { Pencil } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const MAX_FRAME_SIZE = 360; // reference crop diameter; shrinks to fit the viewport
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ENTRANCE_ANIMATION = "animate-[fu-enter_300ms_ease-out]";

type Stage = "idle" | "editing";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Joins class names, skipping falsy values (stand-in for shadcn's `cn`). */
function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/* ------------------------------------------------------------------ */
/* Icons (inline SVG, lucide style)                                    */
/* ------------------------------------------------------------------ */

type IconProps = { className?: string };

function Icon({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const RotateIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
  </Icon>
);

const ZoomIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8" cy="8" r="1" />
    <path d="m4 17 5-5 3 3 3-5 5 7" />
  </Icon>
);

/* ------------------------------------------------------------------ */
/* Button (stand-in for shadcn's Button)                               */
/* ------------------------------------------------------------------ */

type ButtonVariant = "primary" | "outline" | "ghost";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: "border border-[#D4D4D4] bg-[#050505] text-[#D4D4D4] hover:bg-[#D4D4D4]/10",
  outline:
    "border border-[#D4D4D4] bg-[#D4D4D4] text-[#050505] hover:bg-[#D4D4D4]/80",
  ghost: "text-[#D4D4D4] hover:bg-[#D4D4D4]/10",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={cx(
        "inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4D4D4]",
        "disabled:pointer-events-none disabled:opacity-50",
        BUTTON_VARIANTS[variant],
        className,
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/* FileUpload                                                          */
/* ------------------------------------------------------------------ */

export default function FileUpload() {
  const [stage, setStage] = useState<Stage>("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [pfpAnimate, setpfpAnimate] = useState(false);
  const [frameSize, setFrameSize] = useState(MAX_FRAME_SIZE);

  const rootRef = useRef<HTMLDivElement>(null);
  const frameSizeRef = useRef(MAX_FRAME_SIZE);
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const dragCounter = useRef(0);
  const dragState = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  // Free the blob URL when the component unmounts.
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new ResizeObserver(([entry]) => {
      const size = Math.max(1, Math.min(MAX_FRAME_SIZE, entry.contentRect.width - 32, entry.contentRect.height - 120));
      const ratio = size / frameSizeRef.current;
      frameSizeRef.current = size;
      setFrameSize(size);
      setOffset((previous) => ({ x: previous.x * ratio, y: previous.y * ratio }));
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const loadFile = useCallback((file: File | undefined) => {
    if (!file || !ACCEPTED_TYPES.includes(file.type)) return;
    const url = URL.createObjectURL(file);
    loadImage(url)
      .then((img) => {
        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = url;
        setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
        setImageUrl(url);
        setZoom(1);
        setRotation(0);
        setOffset({ x: 0, y: 0 });
        setStage("editing");
      })
      .catch(() => URL.revokeObjectURL(url));
  }, []);

  /* ---- File picking: click, keyboard, drag & drop ---- */

  const openFilePicker = () => inputRef.current?.click();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    loadFile(e.target.files?.[0]);
    e.target.value = ""; // allow picking the same file again later
  };

  const handleZoneKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFilePicker();
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current += 1;
    setIsDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragActive(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragActive(false);
    loadFile(e.dataTransfer.files[0]);
  };

  /* ---- Panning the image inside the circle ---- */

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: offset.x,
      originY: offset.y,
    };
    setpfpAnimate(false);
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const clampHelper = (x: number, y: number, z: number, rot: number) => {
    let w = naturalSize.width * displayScale * z;
    let h = naturalSize.height * displayScale * z;

    if (rot % 180 !== 0) {
      const temp = w;
      w = h;
      h = temp;
    }
    const maxX = (w - frameSize) / 2;
    const maxY = (h - frameSize) / 2;

    if(x > maxX) {
      x = maxX;
    }
    else if(x < -maxX) {
      x = -maxX;
    }

    if(y > maxY) {
      y = maxY;
    }
    else if(y < -maxY) {
      y = -maxY;
    }
    
    return({ x, y });
  }

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    const x = dragState.current.originX + (e.clientX - dragState.current.startX);
    const y = dragState.current.originY + (e.clientY - dragState.current.startY);
    
    setOffset(clampHelper(x, y, zoom, rotation));
  };

  const handlePointerUp = () => {
    dragState.current = null;
    setIsDragging(false);
  };

  /* ---- Sizing ---- */

  // Scale so the image's shorter side exactly fills the circle at zoom 1.
  const displayScale = naturalSize.width && naturalSize.height
    ? frameSize / Math.min(naturalSize.width, naturalSize.height)
    : 1;

  const displaySize = {
    width: naturalSize.width * displayScale * zoom,
    height: naturalSize.height * displayScale * zoom,
  };

  /* ---- Render ---- */

  return (
    <div ref={rootRef} className="flex h-full w-full items-center justify-center [container-type:size]">
      {/* Keyframes for the entrance animation (replaces tw-animate-css). */}
      <style>{`@keyframes fu-enter{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}`}</style>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={handleInputChange}
      />

      <div className={cx("w-full py-2", stage === "idle" ? "max-w-sm px-2 sm:px-6" : "max-w-[860px]")}>
        {stage === "idle" && (
          <div className="flex flex-col items-center gap-2 text-center">
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload an image"
              onClick={openFilePicker}
              onKeyDown={handleZoneKeyDown}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={cx(
                "relative cursor-pointer rounded-full transition-transform duration-200",
                "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4D4D4]",
                isDragActive
                  ? "scale-105"
                  : "hover:scale-[1.02]",
              )}
              style={{ aspectRatio: "1", width: "min(280px, 100%, max(0px, calc(100cqh - 104px)))" }}
            >
              <SlimeOrb src="/upload-orb-texture.webp" />
            </div>
          </div>
        )}

        {stage === "editing" && imageUrl && (
          <div className={cx(ENTRANCE_ANIMATION, "grid gap-4 sm:gap-6")}>
            <div className="flex w-full items-center justify-center p-4">
              <div className="relative shrink-0" style={{ width: frameSize, height: frameSize }}>
              <div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className={cx(
                  "relative h-full w-full touch-none select-none overflow-hidden rounded-full",
                  isDragging ? "cursor-grabbing" : "cursor-grab",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Crop preview"
                  draggable={false}
                  className="pointer-events-none absolute left-1/2 top-1/2 max-w-none"
                  style={{
                    width: displaySize.width,
                    height: displaySize.height,
                    transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg)`,
                    transition: pfpAnimate ? "transform 150ms ease-out" : "none",
                  }}
                />
                <div className="pointer-events-none absolute inset-0 rounded-full border-white" style={{ borderWidth: Math.max(4, frameSize / 36) }} />
              </div>
              <button
                type="button"
                onClick={openFilePicker}
                aria-label="Edit photo"
                title="Choose a new photo"
                className="absolute bottom-[14.65%] right-[14.65%] flex size-11 translate-x-1/2 translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-4 border-[#050505] bg-white text-[#050505] shadow-md transition-colors hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <Pencil className="size-4" aria-hidden="true" />
              </button>
              </div>
            </div>
            <div className="mx-auto flex w-full max-w-[440px] items-center gap-2 px-1">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <ZoomIcon className="pointer-events-none size-5 shrink-0 text-[#96969E]" />
                <label className="flex min-w-0 flex-1 items-center">
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => {
                    const newZoom = Number(e.target.value);
                    setpfpAnimate(false);
                    setZoom(newZoom);
                    setOffset(clampHelper(offset.x, offset.y, newZoom, rotation));}}
                  aria-label="Zoom"
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#3B3B43] accent-white [&::-webkit-slider-thumb]:size-7 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#DEDEE3] [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:size-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#DEDEE3] [&::-moz-range-thumb]:bg-white"
                />
                </label>
                <ZoomIcon className="size-9 shrink-0 text-[#96969E]" />
              </div>
              <Button
                variant="ghost"
                aria-label="Rotate photo clockwise"
                title="Rotate photo clockwise"
                className="size-11 shrink-0 px-2 text-[#96969E]"
                onClick={() => {
                  const newRotation = rotation + 90;
                  setpfpAnimate(true);
                  setRotation(newRotation);
                  setOffset(clampHelper(offset.x, offset.y, zoom, newRotation));
                }}
              >
                <RotateIcon className="size-8" />
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

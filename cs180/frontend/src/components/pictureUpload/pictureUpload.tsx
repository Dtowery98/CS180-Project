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
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const FRAME_SIZE = 208; // on-screen crop circle, px
const OUTPUT_SIZE = 320; // exported PNG, px
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ENTRANCE_ANIMATION = "animate-[fu-enter_300ms_ease-out]";

type Stage = "idle" | "editing" | "done";

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

const ImageIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </Icon>
);

const CheckIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M20 6 9 17l-5-5" />
  </Icon>
);

const RotateIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
  </Icon>
);

const UploadIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </Icon>
);

const ZoomIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" x2="16.65" y1="21" y2="16.65" />
    <line x1="11" x2="11" y1="8" y2="14" />
    <line x1="8" x2="14" y1="11" y2="11" />
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
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [pfpAnimate, setpfpAnimate] = useState(false);

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

  const resetEditor = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  const loadFile = useCallback((file: File | undefined) => {
    if (!file || !ACCEPTED_TYPES.includes(file.type)) return;
    const url = URL.createObjectURL(file);
    loadImage(url)
      .then((img) => {
        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = url;
        setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
        setImageUrl(url);
        setResultUrl(null);
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
    const maxX = (w - FRAME_SIZE) / 2;
    const maxY = (h - FRAME_SIZE) / 2;

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
  const displayScale = useMemo(() => {
    const { width, height } = naturalSize;
    if (!width || !height) return 1;
    return FRAME_SIZE / Math.min(width, height);
  }, [naturalSize]);

  const displaySize = useMemo(
    () => ({
      width: naturalSize.width * displayScale * zoom,
      height: naturalSize.height * displayScale * zoom,
    }),
    [naturalSize, displayScale, zoom],
  );

  /* ---- Export the cropped circle as a PNG ---- */

  const confirmCrop = () => {
    if (!imageUrl) return;
    loadImage(imageUrl).then((img) => {
      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const outputScale = OUTPUT_SIZE / FRAME_SIZE;
      ctx.save();
      ctx.beginPath();
      ctx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, 0, Math.PI * 2);
      ctx.clip();

      // Same order as the CSS preview: move by the pan offset, then rotate
      // around the image's own center.
      ctx.translate(
        OUTPUT_SIZE / 2 + offset.x * outputScale,
        OUTPUT_SIZE / 2 + offset.y * outputScale,
      );
      ctx.rotate((rotation * Math.PI) / 180);
      const scale = displayScale * zoom * outputScale;
      ctx.scale(scale, scale);
      ctx.drawImage(img, -naturalSize.width / 2, -naturalSize.height / 2);
      ctx.restore();

      setResultUrl(canvas.toDataURL("image/png"));
      setStage("done");
    });
  };

  const startOver = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setStage("idle");
    setImageUrl(null);
    setResultUrl(null);
    resetEditor();
  };

  /* ---- Render ---- */

  return (
    <div className="flex w-full items-center justify-center">
      {/* Keyframes for the entrance animation (replaces tw-animate-css). */}
      <style>{`@keyframes fu-enter{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}`}</style>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={handleInputChange}
      />

      <div className="w-full max-w-sm rounded-xl bg-[#050505] px-6 py-6">
        {stage === "idle" && (
          <div className="flex flex-col items-center gap-4 py-2 text-center">
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
                "relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-full border-2 p-6 transition-all duration-200",
                "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900",
                isDragActive
                  ? "scale-[1.02] border-[#D4D4D4] bg-[#D4D4D4]/5"
                  : "border-[#D4D4D4]/40 hover:border-[#D4D4D4]/70",
              )}
              style={{ width: FRAME_SIZE, height: FRAME_SIZE }}
            >
              <div className="flex size-10 items-center justify-center rounded-full">
                <ImageIcon className="size-4 text-neutral-500" />
              </div>
              <p className="text-xs font-medium text-neutral-500">
                {isDragActive ? "Drop it here" : "Drag & drop an image"}
              </p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Button variant="outline" onClick={openFilePicker}>
                Browse Image
              </Button>
            </div>
          </div>
        )}

        {stage === "editing" && imageUrl && (
          <div className={cx(ENTRANCE_ANIMATION, "grid gap-5")}>
            <div className="flex flex-col items-center gap-4">
              <div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className={cx(
                  "relative touch-none select-none overflow-hidden rounded-full border-2 border-neutral-900/40 bg-neutral-100",
                  isDragging ? "cursor-grabbing" : "cursor-grab",
                )}
                style={{ width: FRAME_SIZE, height: FRAME_SIZE }}
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
                <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/40" />
              </div>

              <label className="flex w-full items-center gap-3">
                <ZoomIcon className="size-3.5 shrink-0 text-[#D4D4D4]" />
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
                  className="h-1.5 w-full cursor-pointer accent-neutral-900"
                />
              </label>
            </div>

            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  const newRotation = rotation + 90;
                  setpfpAnimate(true);
                  setRotation(newRotation);
                  setOffset(clampHelper(offset.x, offset.y, zoom, newRotation));
                }}
              >
                <RotateIcon className="size-3.5" />
                Rotate
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={startOver}>
                  Cancel
                </Button>
                <Button onClick={confirmCrop}>
                  <UploadIcon className="size-3.5" />
                  Use Photo
                </Button>
              </div>
            </div>
          </div>
        )}

        {stage === "done" && resultUrl && (
          <div className={cx(ENTRANCE_ANIMATION, "flex flex-col items-center gap-4")}>
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resultUrl}
                alt="Cropped result"
                className=""
                style={{ width: FRAME_SIZE * 0.7, height: FRAME_SIZE * 0.7 }}
              />
              <span
                className={cx(
                  ENTRANCE_ANIMATION,
                  "absolute bottom-0 right-1 flex size-7 items-center justify-center rounded-full bg-teal-400 text-white",
                )}
              >
                <CheckIcon className="size-4" />
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm font-medium text-neutral-900">Photo ready</p>
              <p className="text-xs text-neutral-500">
                Cropped and optimized for upload.
              </p>
            </div>
            <Button variant="outline" onClick={startOver}>
              Choose another photo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
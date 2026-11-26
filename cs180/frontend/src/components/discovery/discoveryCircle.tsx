"use client";

import { useLayoutEffect, useRef, type PointerEvent } from "react";
import { useSpring } from "motion/react";
import ChatBubble from "../ui/chatBubble";

// Positions are percentages of the 471 × 555 Figma card.
const circlePortraits = [
    { src: "/Circular-visual-01.svg", left: "35.142%", top: "67.706%" },
    { src: "/Circular-visual-02.svg", left: "32.794%", top: "2.831%" },
    { src: "/Circular-visual-03.svg", left: "50.318%", top: "36.488%", selected: true },
    { src: "/Circular-visual-04.svg", left: "59.361%", top: "10.959%" },
    { src: "/Circular-visual-05.svg", left: "10.293%", top: "49.378%" },
    { src: "/Circular-visual-06.svg", left: "6.408%", top: "17.4%" },
];

function CirclePattern({ duplicate = false }: { duplicate?: boolean }) {
    return (
        <div aria-hidden={duplicate || undefined} className="@container relative h-full w-full">
            {circlePortraits.map(({ src, left, top, selected }) => (
                <img
                    key={src}
                    src={src}
                    alt={selected ? "Scotty" : ""}
                    className={`absolute aspect-square rounded-full object-contain${selected ? " peer border-[max(2px,0.85cqw)] border-white" : ""}`}
                    style={{ left, top, width: selected ? "38.641%" : "24.416%" }}
                />
            ))}
            <ChatBubble className="pointer-events-none absolute left-[0.64%] top-[30.63%] z-10 hidden w-[51.9%] peer-hover:block">
                CS180 + CS175<br />together :)
            </ChatBubble>
        </div>
    );
}

export default function DiscoveryCircle() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const scrollBy = useRef<((delta: number, immediate?: boolean) => void) | null>(null);
    const dragY = useRef<number | null>(null);
    const smoothPosition = useSpring(0, { stiffness: 260, damping: 34, mass: 0.8 });

    useLayoutEffect(() => {
        const scroller = scrollRef.current;
        const thumb = thumbRef.current;
        const pattern = scroller?.firstElementChild;
        const nextPattern = pattern?.nextElementSibling;
        if (!scroller || !thumb || !pattern || !nextPattern) return;

        const wheelTarget = scroller.parentElement ?? scroller;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        let repeatDistance = 0;
        let position = 0;
        let target = 0;
        let renderedTop = scroller.scrollTop;
        let thumbProgress = 0.5;

        const render = (next: number) => {
            if (repeatDistance <= 0) return;
            thumbProgress = Math.min(1, Math.max(0, thumbProgress + (next - position) / (2 * repeatDistance)));
            thumb.style.top = `${thumbProgress * 80}%`;
            position = next;

            // Keep the viewport in the middle of the three copies, regardless of distance traveled.
            const phase = ((position + repeatDistance / 2) % repeatDistance + repeatDistance) % repeatDistance;
            const top = repeatDistance / 2 + phase;
            if (Math.abs(scroller.scrollTop - top) >= 0.5) scroller.scrollTop = top;
            renderedTop = scroller.scrollTop;
        };
        const stopRendering = smoothPosition.on("change", render);

        scrollBy.current = (delta, immediate = false) => {
            if (repeatDistance <= 0 || delta === 0) return;
            if (immediate || reducedMotion.matches) {
                target = position + delta;
                smoothPosition.jump(target);
            } else {
                target += delta;
                smoothPosition.set(target);
            }
        };

        const measure = () => {
            // The copies overlap slightly, so one loop is the distance between their starts.
            const distance = nextPattern.getBoundingClientRect().top - pattern.getBoundingClientRect().top;
            if (distance <= 0 || distance === repeatDistance) return;
            const next = repeatDistance > 0 ? position * distance / repeatDistance : 0;
            position = next;
            repeatDistance = distance;
            target = next;
            smoothPosition.jump(next);
            render(next);
        };

        const handleWheel = (event: WheelEvent) => {
            if (event.ctrlKey || !event.cancelable || !repeatDistance || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
            event.preventDefault();
            const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? scroller.clientHeight : 1;
            scrollBy.current?.(event.deltaY * unit);
        };

        const handleNativeScroll = () => {
            const delta = scroller.scrollTop - renderedTop;
            if (!repeatDistance || delta === 0) return;
            scrollBy.current?.(delta, true);
        };

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(pattern);
        wheelTarget.addEventListener("wheel", handleWheel, { passive: false });
        scroller.addEventListener("scroll", handleNativeScroll);
        return () => {
            wheelTarget.removeEventListener("wheel", handleWheel);
            scroller.removeEventListener("scroll", handleNativeScroll);
            observer.disconnect();
            stopRendering();
            smoothPosition.stop();
            scrollBy.current = null;
        };
    }, [smoothPosition]);

    function startDrag(event: PointerEvent<HTMLDivElement>) {
        if (!event.isPrimary || event.button !== 0) return;
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        dragY.current = event.clientY;
    }

    function dragScrollbar(event: PointerEvent<HTMLDivElement>) {
        const scroller = scrollRef.current;
        if (!scroller || dragY.current === null || !event.currentTarget.hasPointerCapture(event.pointerId)) return;

        const delta = event.clientY - dragY.current;
        dragY.current = event.clientY;
        const thumb = event.currentTarget;
        const travel = (thumb.parentElement?.clientHeight ?? 0) - thumb.offsetHeight;
        if (delta !== 0 && travel > 0) {
            scrollBy.current?.(delta * (scroller.scrollHeight - scroller.clientHeight) / travel, true);
        }
    }

    return (
        <section className="min-h-0 min-w-0">
            <div className="mx-auto flex h-full w-full max-w-[520px] flex-col">
                <div className="flex min-h-0 flex-1 items-start justify-center [container-type:size]">
                    <div className="@container relative aspect-[471/555] w-[min(100%,84.86cqh)] overflow-hidden rounded-[min(50px,8cqh)] bg-[#121212]">
                        <div
                            ref={scrollRef}
                            role="region"
                            aria-label="Your Circle portraits"
                            tabIndex={0}
                            className="absolute top-0 right-4 bottom-[10%] left-0 overflow-y-auto overscroll-y-contain [overflow-anchor:none] [scrollbar-width:none] [&>*+*]:-mt-[12cqw]"
                        >
                            <CirclePattern duplicate />
                            <CirclePattern />
                            <CirclePattern duplicate />
                        </div>
                        <div aria-hidden="true" className="pointer-events-none absolute right-4 bottom-[10%] left-0 h-[clamp(18px,12%,64px)] bg-linear-to-b from-transparent to-[#121212]" />
                        <div aria-hidden="true" className="pointer-events-none absolute top-0 right-1 bottom-[10%] w-4">
                            <div
                                ref={thumbRef}
                                className="pointer-events-auto absolute top-[40%] flex h-1/5 w-full cursor-grab touch-none select-none items-stretch justify-center active:cursor-grabbing"
                                onPointerDown={startDrag}
                                onPointerMove={dragScrollbar}
                                onLostPointerCapture={() => { dragY.current = null; }}
                            >
                                <div className="w-2.5 rounded-full bg-[#383737] hover:bg-[#555454]" />
                            </div>
                        </div>
                        <p className="absolute inset-x-0 bottom-0 flex h-[10%] items-center justify-center bg-[#121212] text-center text-[5.096cqw] leading-tight text-[#7b7b7b]">
                            click to view schedule
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}


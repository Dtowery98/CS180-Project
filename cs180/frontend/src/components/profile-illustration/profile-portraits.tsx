import Image from "next/image";
import { motion, type MotionValue } from "motion/react";
import type { ReactNode, Ref } from "react";

// Figma frames 198:1259 and 929:9: 392px cards, with titles at y=248.
// Retain the measured sizes, with optical alignment around the card center.
// Normalize that illustration area once so initial, selected, and reverse
// timelines share the same measurements at every responsive card size.
export function portraitGeometry(left: number, top: number, width = 64.6667) {
    return { left: `${left / 392 * 100}%`, top: `${top / 248 * 100}%`, width: `${width / 392 * 100}%` };
}

const portraitPaths = [
    "/Circular-visual-02.svg",
    "/Circular-visual-06.svg",
    "/Circular-visual-04.svg",
    "/Circular-visual-05.svg",
    "/Circular-visual-03.svg",
];
const mainPortraitPath = "/Circular-visual-01.svg";

type ProfilePortraitsProps = {
    positions: ReturnType<typeof portraitGeometry>[];
    mainPosition: ReturnType<typeof portraitGeometry>;
    rotation?: MotionValue<number>;
    counterRotation?: MotionValue<number>;
    blurred?: boolean;
    floatPortraits?: boolean;
};

export function IllustrationFrame({
    scope,
    children,
    className = "max-w-[min(100%,54dvh)] overflow-hidden",
}: {
    scope: Ref<HTMLDivElement>;
    children: ReactNode;
    className?: string;
}) {
    return (
        <div ref={scope} aria-hidden="true" className={`relative mx-auto aspect-[392/248] w-full shrink-0 ${className}`}>
            {children}
        </div>
    );
}

export function ProfilePortraits({ positions, mainPosition, rotation, counterRotation, blurred, floatPortraits }: ProfilePortraitsProps) {
    return (
        <motion.div className="absolute inset-0" style={{ rotate: rotation ?? 0, transformOrigin: `50% ${137 / 248 * 100}%` }}>
            <div className="absolute inset-0">
                {positions.map((position, index) => (
                    <motion.div
                        key={portraitPaths[index]}
                        className={`portrait-${index} absolute`}
                        style={{ ...position, scale: 1, opacity: 1 }}
                        animate={{ y: floatPortraits ? ["0%", `${-10 - index % 3 * 2}%`, "0%"] : "0%" }}
                        transition={floatPortraits
                            ? { duration: 2.6 + index * 0.2, delay: index * 0.12, repeat: Infinity, ease: "easeInOut" }
                            : { duration: 0.4, ease: "easeOut" }}
                    >
                        <motion.div style={{ rotate: counterRotation ?? 0 }}>
                            <Image src={portraitPaths[index]} alt="" width={48} height={48} className="h-auto w-full rounded-full object-cover" />
                        </motion.div>
                    </motion.div>
                ))}
            </div>
            <motion.div className="main-portrait absolute" style={{ ...mainPosition, scale: 1 }}>
                <motion.div style={{ rotate: counterRotation ?? 0 }}>
                    <Image src={mainPortraitPath} alt="" width={96} height={96} className={`h-auto w-full rounded-full object-cover ${blurred ? "blur-[5px]" : "ring-1 ring-white"}`} />
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

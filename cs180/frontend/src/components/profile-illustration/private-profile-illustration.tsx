import { motion, type AnimationSequence } from "motion/react";
import { IllustrationFrame, ProfilePortraits, portraitGeometry } from "./profile-portraits";
import { useProfileAnimation, type ProfileIllustrationProps } from "./use-profile-animation";

const restingPositions = [
    portraitGeometry(163.6667, 11.6667),
    portraitGeometry(33.6667, 68.6667),
    portraitGeometry(269.6667, 34.6667),
    portraitGeometry(45.6667, 166.6667),
    portraitGeometry(283.6667, 147.6667),
];
const mainPortraitPosition = portraitGeometry(132, 89.5, 128);

const privateCollision = portraitGeometry(196 - 64.6667 / 2, 153.5 - 64.6667 / 2);

const privateExit = [
    { left: "35%", top: "-30%" },
    { left: "-30%", top: "0%" },
    { left: "110%", top: "-10%" },
    { left: "-20%", top: "110%" },
    { left: "115%", top: "100%" },
];

function createSequence(selected: boolean): AnimationSequence {
    const sequence: AnimationSequence = [];
    if (selected) {
        sequence.push([".main-portrait", { ...mainPortraitPosition, scale: 1 }, { duration: 0.5, at: 0 }]);
        privateExit.forEach((position, index) => {
            sequence.push([`.portrait-${index}`, {
                left: [null, privateCollision.left, privateCollision.left, position.left],
                top: [null, privateCollision.top, privateCollision.top, position.top],
                scale: [null, 0.72, 1.08, 0.7],
                opacity: [null, 1, 1, 0],
            }, { duration: 0.75, times: [0, 0.38, 0.52, 1], ease: "easeInOut", at: index * 0.025 }]);
        });
        sequence.push(
            [".lock", { opacity: 1 }, { duration: 0.25, at: 0.7 }],
            [".lock-body", { pathLength: 1 }, { duration: 0.3, ease: "easeInOut", at: 0.72 }],
            [".lock-shackle", { pathLength: 1 }, { duration: 0.25, ease: "easeInOut", at: 0.75 }],
            [".lock-shackle", { y: 0 }, { duration: 0.22, ease: [0.22, 1, 0.36, 1], at: 1 }],
            [".lock-keyhole", { opacity: 1 }, { duration: 0.18, at: 1.1 }],
        );
    } else {
        // Return from the current frame when the other card is selected.
        sequence.push(
            [".lock-keyhole", { opacity: 0 }, { duration: 0.12, at: 0 }],
            [".lock-shackle", { y: -5 }, { duration: 0.2, ease: "easeInOut", at: 0 }],
            [".lock-shackle", { pathLength: 0 }, { duration: 0.2, at: 0.12 }],
            [".lock-body", { pathLength: 0 }, { duration: 0.22, at: 0.1 }],
            [".lock", { opacity: 0 }, { duration: 0.2, at: 0.15 }],
            [".main-portrait", { ...mainPortraitPosition, scale: 1 }, { duration: 0.5, at: 0.25 }],
        );
        restingPositions.forEach((position, index) => {
            sequence.push([`.portrait-${index}`, {
                left: [null, privateCollision.left, position.left],
                top: [null, privateCollision.top, position.top],
                opacity: [null, 1, 1],
                scale: [null, 0.75, 1],
            }, { duration: 0.6, times: [0, 0.45, 1], ease: "easeInOut", at: 0.25 + index * 0.025 }]);
        });
    }
    return sequence;
}

function PrivacyLock() {
    return (
        <div className="pointer-events-none absolute aspect-square -translate-x-1/2 -translate-y-1/2" style={{ left: "50%", top: `${153.5 / 248 * 100}%`, width: `${99 / 392 * 100}%` }}>
            <motion.svg key="reference-outline-lock" className="lock h-full w-full overflow-visible" viewBox="0 0 64 72" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" initial={{ opacity: 0 }} style={{ scale: 1, y: 0, rotate: 0 }}>
                <motion.path className="lock-body" d="M12 29H52A5 5 0 0 1 57 34V61A5 5 0 0 1 52 66H12A5 5 0 0 1 7 61V34A5 5 0 0 1 12 29Z" fill="none" initial={{ pathLength: 0 }} />
                <motion.path className="lock-shackle" d="M18 29V20A14 14 0 0 1 46 20V29" fill="none" initial={{ pathLength: 0, y: -5 }} style={{ rotate: 0 }} />
                <motion.circle className="lock-keyhole" cx="32" cy="47" r="3" fill="none" initial={{ opacity: 0 }} style={{ scale: 1 }} />
            </motion.svg>
        </div>
    );
}

export function PrivateProfileIllustration({ active, activation, selected }: ProfileIllustrationProps) {
    const { scope, reduceMotion, readyForHover } = useProfileAnimation(activation, selected, createSequence);

    return (
        <IllustrationFrame scope={scope}>
            <ProfilePortraits positions={restingPositions} mainPosition={mainPortraitPosition} blurred floatPortraits={!reduceMotion && active && readyForHover} />
            <PrivacyLock />
        </IllustrationFrame>
    );
}

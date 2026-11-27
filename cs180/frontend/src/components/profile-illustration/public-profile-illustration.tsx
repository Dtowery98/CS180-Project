"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAnimationFrame, useMotionValue, useSpring, useTransform, type AnimationSequence } from "motion/react";
import { IllustrationFrame, ProfilePortraits, portraitGeometry } from "./profile-portraits";
import { useProfileAnimation, type ProfileIllustrationProps } from "./use-profile-animation";

const restingPositions = [
    portraitGeometry(163.6667, 40),
    portraitGeometry(107.6748, 72.3333),
    portraitGeometry(219.6585, 72.3333),
    portraitGeometry(107.6748, 137),
    portraitGeometry(219.6585, 137),
];
const mainPortraitPosition = portraitGeometry(163.6667, 169.3333);

const publicCircle = [
    portraitGeometry(163.6667, 31),
    portraitGeometry(87.6667, 71.6667),
    portraitGeometry(239.6667, 71.6667),
    portraitGeometry(87.6667, 165.6667),
    portraitGeometry(239.6667, 165.6667),
];
const publicCenter = portraitGeometry(161.5, 119, 69);

// Match the live angular velocity at the handoff, then ease acceleration and
// velocity to zero at the end. This avoids a stop between hover and selection.
function orbitEase(velocity: number, distance: number, duration: number) {
    const slope = distance === 0 ? 0 : Math.max(-2, Math.min(2, velocity * duration / distance));
    return (t: number) => {
        const smooth = t ** 3 * (10 - 15 * t + 6 * t ** 2);
        const momentum = t - 6 * t ** 3 + 8 * t ** 4 - 3 * t ** 5;
        return smooth + slope * momentum;
    };
}

export function PublicProfileIllustration(props: ProfileIllustrationProps | { loop: true }) {
    const loop = "loop" in props;
    const { active, activation, selected } = loop
        ? { active: true, activation: 0, selected: false }
        : props;
    const rotation = useMotionValue(0);
    const counterRotation = useTransform(rotation, (angle) => -angle);
    const targetSpeed = useMotionValue(0);
    const speed = useSpring(targetSpeed, { stiffness: 70, damping: 22 });
    const startingRotation = useRef(0);

    const createSequence = useCallback((selected: boolean): AnimationSequence => {
        const sequence: AnimationSequence = [];
        if (selected) {
            // Continue the original hover orbit from its current angle. Keep
            // its origin and counter-rotation intact through the handoff.
            const endRotation = Math.ceil((rotation.get() + 180) / 360) * 360;
            const spinDuration = Math.max(0.85, Math.min(1.1, (endRotation - rotation.get()) / 450));
            startingRotation.current = rotation.get();
            sequence.push([rotation, endRotation, { duration: spinDuration, ease: orbitEase(rotation.getVelocity(), endRotation - rotation.get(), spinDuration), at: 0 }]);
            publicCircle.forEach((position, index) => {
                // Resolve the starting positions from the live frame instead
                // of resetting the portraits to a preset starting pose.
                sequence.push([`.portrait-${index}`, position, { duration: 0.8, ease: [0.45, 0, 0.2, 1], at: spinDuration * 0.65 }]);
            });
            sequence.push([".main-portrait", { ...publicCenter, scale: 1 }, { duration: 0.8, ease: [0.45, 0, 0.2, 1], at: spinDuration * 0.65 }]);
        } else {
            // Return from the current frame when the other card is selected.
            restingPositions.forEach((position, index) => {
                sequence.push([`.portrait-${index}`, position, { duration: 0.7, ease: [0.45, 0, 0.2, 1], at: 0 }]);
            });
            sequence.push(
                [".main-portrait", { ...mainPortraitPosition, scale: 1 }, { duration: 0.7, ease: [0.45, 0, 0.2, 1], at: 0 }],
                [rotation, startingRotation.current, { duration: 0.95, ease: orbitEase(rotation.getVelocity(), startingRotation.current - rotation.get(), 0.95), at: 0 }],
            );
        }
        return sequence;
    }, [rotation]);

    const { scope, reduceMotion, readyForHover } = useProfileAnimation(activation, selected, createSequence);

    useEffect(() => {
        targetSpeed.set(active && readyForHover && !reduceMotion ? 28 : 0);
    }, [active, readyForHover, reduceMotion, targetSpeed]);

    useAnimationFrame((_, delta) => {
        if (readyForHover && !reduceMotion) {
            // Ease to a stop on pointer exit, keeping every portrait upright.
            rotation.set(rotation.get() + speed.get() * Math.min(delta, 40) / 1000);
        }
    });

    // The 392px canvas contains a 194px orbit. Match the previous auth
    // spinner's 370px sweep in its 350px slot and center the rotation pivot.
    const loopFrameClass = "origin-[50%_55.24%] -translate-y-[5.24%] scale-[2.14] overflow-visible";
    const illustration = (
        <IllustrationFrame scope={scope} className={loop ? loopFrameClass : undefined}>
            <ProfilePortraits
                positions={restingPositions}
                mainPosition={mainPortraitPosition}
                rotation={rotation}
                counterRotation={counterRotation}
            />
        </IllustrationFrame>
    );

    if (loop) {
        return <div className="mx-auto flex aspect-square w-full max-w-[350px] items-center">{illustration}</div>;
    }

    return illustration;
}

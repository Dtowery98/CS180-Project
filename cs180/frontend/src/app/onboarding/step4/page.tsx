"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useAnimate, useAnimationFrame, useMotionValue, useReducedMotion, useSpring, useTransform, type AnimationSequence } from "motion/react";
import OnboardingNavbar from "@/components/onboardingNav/onboardingNav";

type Visibility = "public" | "private";

const profiles = [
    { value: "public", title: "Public profile", description: "Other UCR students can discover and view your profile." },
    { value: "private", title: "Private profile", description: "Only approved followers can view your profile details." },
] as const;

// Figma frames 198:1259 and 929:9: 392px cards, with titles at y=248.
// Retain the measured sizes, with optical alignment around the card center.
// Normalize that illustration area once so initial, selected, and reverse
// timelines share the same measurements at every responsive card size.
function portraitGeometry(left: number, top: number, width = 64.6667) {
    return { left: `${left / 392 * 100}%`, top: `${top / 248 * 100}%`, width: `${width / 392 * 100}%` };
}

const people = [
    { src: "/Circular-visual-02.svg", public: portraitGeometry(163.6667, 40), private: portraitGeometry(163.6667, 11.6667) },
    { src: "/Circular-visual-06.svg", public: portraitGeometry(107.6748, 72.3333), private: portraitGeometry(33.6667, 68.6667) },
    { src: "/Circular-visual-04.svg", public: portraitGeometry(219.6585, 72.3333), private: portraitGeometry(269.6667, 34.6667) },
    { src: "/Circular-visual-05.svg", public: portraitGeometry(107.6748, 137), private: portraitGeometry(45.6667, 166.6667) },
    { src: "/Circular-visual-03.svg", public: portraitGeometry(219.6585, 137), private: portraitGeometry(283.6667, 147.6667) },
    { src: "/Circular-visual-01.svg", public: portraitGeometry(163.6667, 169.3333), private: portraitGeometry(132, 89.5, 128) },
];

const publicCircle = [
    portraitGeometry(163.6667, 31),
    portraitGeometry(87.6667, 71.6667),
    portraitGeometry(239.6667, 71.6667),
    portraitGeometry(87.6667, 165.6667),
    portraitGeometry(239.6667, 165.6667),
];
const publicCenter = portraitGeometry(161.5, 119, 69);
const privateCollision = portraitGeometry(196 - 64.6667 / 2, 153.5 - 64.6667 / 2);

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

const privateExit = [
    { left: "35%", top: "-30%" },
    { left: "-30%", top: "0%" },
    { left: "110%", top: "-10%" },
    { left: "-20%", top: "110%" },
    { left: "115%", top: "100%" },
];

function ProfileIllustration({ visibility, active, activation, selected }: { visibility: Visibility; active: boolean; activation: number; selected: boolean }) {
    const reduceMotion = useReducedMotion();
    const [scope, animate] = useAnimate();
    const rotation = useMotionValue(0);
    const counterRotation = useTransform(rotation, (angle) => -angle);
    const targetSpeed = useMotionValue(0);
    const speed = useSpring(targetSpeed, { stiffness: 70, damping: 22 });
    const [restoredActivation, setRestoredActivation] = useState(0);
    const startingRotation = useRef(0);
    const readyForHover = activation === 0 || (!selected && restoredActivation === activation);
    const floatPortraits = !reduceMotion && active && readyForHover && visibility === "private";

    useEffect(() => {
        targetSpeed.set(active && readyForHover && visibility === "public" && !reduceMotion ? 28 : 0);
    }, [active, readyForHover, visibility, reduceMotion, targetSpeed]);

    useEffect(() => {
        if (activation === 0) return;

        // Only a new selection starts a timeline. Changing selection stops the
        // previous timeline and reverses from its current frame.
        const sequence: AnimationSequence = [];
        if (!selected) {
            // Reverse from the live frame, so switching midway through a click
            // animation also returns smoothly to the original illustration.
            if (visibility === "public") {
                people.slice(0, 5).forEach((person, index) => {
                    sequence.push([`.portrait-${index}`, person.public, { duration: 0.7, ease: [0.45, 0, 0.2, 1], at: 0 }]);
                });
                sequence.push(
                    [".main-portrait", { ...people[5].public, scale: 1 }, { duration: 0.7, ease: [0.45, 0, 0.2, 1], at: 0 }],
                    [rotation, startingRotation.current, { duration: 0.95, ease: orbitEase(rotation.getVelocity(), startingRotation.current - rotation.get(), 0.95), at: 0 }],
                );
            } else {
                sequence.push(
                    [".lock-keyhole", { opacity: 0 }, { duration: 0.12, at: 0 }],
                    [".lock-shackle", { y: -5 }, { duration: 0.2, ease: "easeInOut", at: 0 }],
                    [".lock-shackle", { pathLength: 0 }, { duration: 0.2, at: 0.12 }],
                    [".lock-body", { pathLength: 0 }, { duration: 0.22, at: 0.1 }],
                    [".lock", { opacity: 0 }, { duration: 0.2, at: 0.15 }],
                    [".main-portrait", { ...people[5].private, scale: 1 }, { duration: 0.5, at: 0.25 }],
                );
                people.slice(0, 5).forEach((person, index) => {
                    sequence.push([`.portrait-${index}`, {
                        left: [null, privateCollision.left, person.private.left],
                        top: [null, privateCollision.top, person.private.top],
                        opacity: [null, 1, 1],
                        scale: [null, 0.75, 1],
                    }, { duration: 0.6, times: [0, 0.45, 1], ease: "easeInOut", at: 0.25 + index * 0.025 }]);
                });
            }
        } else if (visibility === "public") {
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
            sequence.push([".main-portrait", { ...people[5].private, scale: 1 }, { duration: 0.5, at: 0 }]);
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
        }

        const playback = animate(sequence, reduceMotion ? { duration: 0 } : undefined);
        let cancelled = false;
        void playback.then(() => {
            if (!cancelled && !selected) setRestoredActivation(activation);
        });
        return () => {
            cancelled = true;
            playback.stop();
        };
    }, [activation, selected, visibility, reduceMotion, animate, rotation]);

    useAnimationFrame((_, delta) => {
        if (visibility === "public" && readyForHover && !reduceMotion) {
            // Ease to a stop on pointer exit, keeping every portrait upright.
            rotation.set(rotation.get() + speed.get() * Math.min(delta, 40) / 1000);
        }
    });

    return (
        <div ref={scope} aria-hidden="true" className="relative mx-auto aspect-[392/248] w-full max-w-[min(100%,54dvh)] shrink-0 overflow-hidden">
            <motion.div className="absolute inset-0" style={{ rotate: visibility === "public" ? rotation : 0, transformOrigin: `50% ${137 / 248 * 100}%` }}>
            <div className="absolute inset-0">
            {people.slice(0, 5).map((position, index) => (
                <motion.div
                    key={index}
                    className={`portrait-${index} absolute`}
                    style={{ ...position[visibility], scale: 1, opacity: 1 }}
                    animate={{ y: floatPortraits ? ["0%", `${-10 - index % 3 * 2}%`, "0%"] : "0%" }}
                    transition={floatPortraits
                        ? { duration: 2.6 + index * 0.2, delay: index * 0.12, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 0.4, ease: "easeOut" }}
                >
                <motion.div style={{ rotate: visibility === "public" ? counterRotation : 0 }}>
                <Image
                    src={position.src}
                    alt=""
                    width={48}
                    height={48}
                    className="h-auto w-full rounded-full object-cover"
                />
                </motion.div>
                </motion.div>
            ))}
            </div>
            <motion.div className="main-portrait absolute" style={{ ...people[5][visibility], scale: 1 }}>
                <motion.div
                    style={{ rotate: visibility === "public" ? counterRotation : 0 }}
                >
                    <Image src={people[5].src} alt="" width={96} height={96} className={`h-auto w-full rounded-full object-cover ${visibility === "private" ? "blur-[5px]" : "ring-1 ring-white"}`} />
                </motion.div>
            </motion.div>
            </motion.div>
            {visibility === "private" && (
                <div className="pointer-events-none absolute aspect-square -translate-x-1/2 -translate-y-1/2" style={{ left: "50%", top: `${153.5 / 248 * 100}%`, width: `${99 / 392 * 100}%` }}>
                    <motion.svg key="reference-outline-lock" className="lock h-full w-full overflow-visible" viewBox="0 0 64 72" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" initial={{ opacity: 0 }} style={{ scale: 1, y: 0, rotate: 0 }}>
                        <motion.path className="lock-body" d="M12 29H52A5 5 0 0 1 57 34V61A5 5 0 0 1 52 66H12A5 5 0 0 1 7 61V34A5 5 0 0 1 12 29Z" fill="none" initial={{ pathLength: 0 }} />
                        <motion.path className="lock-shackle" d="M18 29V20A14 14 0 0 1 46 20V29" fill="none" initial={{ pathLength: 0, y: -5 }} style={{ rotate: 0 }} />
                        <motion.circle className="lock-keyhole" cx="32" cy="47" r="3" fill="none" initial={{ opacity: 0 }} style={{ scale: 1 }} />
                    </motion.svg>
                </div>
            )}
        </div>
    );
}

export default function ProfileSwitch() {
    const router = useRouter();
    const [visibility, setVisibility] = useState<Visibility | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [hovered, setHovered] = useState<Visibility | null>(null);
    const [focused, setFocused] = useState<Visibility | null>(null);
    const [activations, setActivations] = useState({ public: 0, private: 0 });
    const currentSelection = useRef<Visibility | null>(null);
    const reduceMotion = useReducedMotion();

    function activateProfile(profile: Visibility) {
        // Click and change may both fire for the same native radio interaction.
        // Update the guard synchronously so neither event nor a double-click
        // can interrupt and restart an already selected card's timeline.
        if (isSaving || currentSelection.current === profile) return;
        currentSelection.current = profile;
        setVisibility(profile);
        setActivations((previous) => ({ ...previous, [profile]: previous[profile] + 1 }));
    }

    function confirmProfile(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (visibility === null || isSaving) return;
        setError("");
        setIsSaving(true);

        try {
            // Retain the choice locally until a profile settings API is available.
            localStorage.setItem("rspace:profile-visibility", visibility);
            router.push("/");
        } catch {
            setError("Your preference could not be saved. Please try again.");
            setIsSaving(false);
        }
    }

    return (
        <main className="flex h-dvh w-full flex-col overflow-hidden bg-[#050505] px-4 pb-[clamp(12px,3dvh,28px)] text-[#F9FAFB] sm:px-6 [&_ol]:max-w-[552px]">
            <div className="h-16 w-full shrink-0 sm:h-[clamp(48px,8dvh,64px)]">
                <OnboardingNavbar currentStep={5} totalSteps={5} />
            </div>

            <section aria-labelledby="privacy-heading" className="mx-auto flex min-h-0 w-full max-w-[740px] flex-1 flex-col">
                <div className="shrink-0 text-center">
                    <h1 id="privacy-heading" className="text-[clamp(22px,5.4dvh,40px)] font-normal leading-[1.2] tracking-[-0.025em]">
                        One last thing before<br className="hidden sm:block" /> you join R’Space
                    </h1>
                    <p id="privacy-description" className="mt-[clamp(4px,1.6dvh,12px)] text-[clamp(14px,2.8dvh,21px)] leading-snug">
                        Choose who can see your profile
                    </p>
                    <p className="mt-1 text-[clamp(12px,2dvh,15px)] leading-snug text-[#999EA6]">You can change this anytime.</p>
                </div>

                <form onSubmit={confirmProfile} className="mt-[clamp(8px,2.7dvh,20px)] flex min-h-0 flex-1 flex-col items-center justify-start gap-[clamp(8px,4dvh,32px)]">
                    <fieldset aria-describedby="privacy-description" disabled={isSaving} className="min-h-0 w-full max-w-[740px]">
                        <legend className="sr-only">Profile visibility</legend>
                        <div className="grid grid-cols-2 justify-items-center gap-3 sm:gap-8 md:gap-[88px]">
                            {profiles.map((profile) => (
                                <motion.label
                                    key={profile.value}
                                    className="relative block w-full max-w-[326px] cursor-pointer"
                                    onHoverStart={() => !isSaving && setHovered(profile.value)}
                                    onHoverEnd={() => setHovered(null)}
                                    onFocus={() => setFocused(profile.value)}
                                    onBlur={() => setFocused(null)}
                                >
                                    <input
                                        type="radio"
                                        name="profile-visibility"
                                        value={profile.value}
                                        checked={visibility === profile.value}
                                        onChange={() => activateProfile(profile.value)}
                                        onClick={() => activateProfile(profile.value)}
                                        className="peer sr-only"
                                        aria-describedby={`${profile.value}-description`}
                                    />
                                    <div className="flex h-full flex-col items-center rounded-[24px] border border-white/12 bg-[#121212] pb-[clamp(10px,4.3dvh,32px)] transition-colors duration-300 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[6px] peer-focus-visible:outline-white hover:bg-[#181818] sm:rounded-[32px] motion-reduce:transition-none">
                                        <motion.div
                                            aria-hidden="true"
                                            initial={false}
                                            animate={{
                                                opacity: visibility === profile.value ? 1 : 0,
                                                scale: reduceMotion || visibility === profile.value ? 1 : 0.985,
                                            }}
                                            transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
                                            className="pointer-events-none absolute inset-0 z-10 rounded-[24px] border-[5px] border-white sm:rounded-[32px]"
                                        />
                                        <motion.span
                                            aria-hidden="true"
                                            animate={{ backgroundColor: visibility === profile.value ? "#FFFFFF" : "#FFFFFF00", borderColor: visibility === profile.value ? "#FFFFFF" : "#737880" }}
                                            transition={{ duration: reduceMotion ? 0 : 0.25 }}
                                            className="absolute right-3 top-3 z-10 h-4 w-4 rounded-full border-[1.5px] sm:right-[22px] sm:top-[33px] sm:h-5 sm:w-5"
                                        />
                                        <ProfileIllustration visibility={profile.value} selected={visibility === profile.value} activation={activations[profile.value]} active={!isSaving && (hovered === profile.value || focused === profile.value)} />
                                        <span className="text-[clamp(15px,3.1dvh,23px)] font-medium leading-snug tracking-[-0.025em]">{profile.title}</span>
                                        <span id={`${profile.value}-description`} className="mt-2 max-w-[264px] px-2 text-center text-xs leading-normal text-[#B0B2B8] sm:text-sm">
                                            {profile.description}
                                        </span>
                                    </div>
                                </motion.label>
                            ))}
                        </div>
                    </fieldset>

                    {error && <p role="alert" className="shrink-0 text-center text-xs text-red-300">{error}</p>}

                    <button
                        type="submit"
                        disabled={isSaving || visibility === null}
                        className={`mx-auto block h-[clamp(44px,10.8dvh,80px)] w-full max-w-[462px] shrink-0 cursor-pointer rounded-[36px] border border-[#2A2A2A] px-6 text-[clamp(18px,3.8dvh,28px)] leading-snug transition-colors enabled:hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-default motion-reduce:transition-none ${visibility === null ? "bg-[#121212] text-[#F9FAFB]" : "bg-[#F5F7FA] text-[#050505]"} ${isSaving ? "opacity-70" : ""}`}
                    >
                        {isSaving ? "Confirming…" : "Confirm"}
                    </button>
                </form>
            </section>
        </main>
    );
}


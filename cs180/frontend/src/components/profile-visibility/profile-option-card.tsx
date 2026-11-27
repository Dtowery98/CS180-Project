import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { PublicProfileIllustration } from "@/components/profile-illustration/public-profile-illustration";
import { PrivateProfileIllustration } from "@/components/profile-illustration/private-profile-illustration";

export type Visibility = "public" | "private";

type ProfileOptionCardProps = {
    profile: { value: Visibility; title: string; description: string };
    selected: boolean;
    activation: number;
    isSaving: boolean;
    onSelect: (profile: Visibility) => void;
};

export function ProfileOptionCard({ profile, selected, activation, isSaving, onSelect }: ProfileOptionCardProps) {
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const reduceMotion = useReducedMotion();
    const Illustration = profile.value === "public" ? PublicProfileIllustration : PrivateProfileIllustration;

    return (
        <motion.label
            className="relative block w-full max-w-[326px] cursor-pointer"
            onHoverStart={() => !isSaving && setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
        >
            <input
                type="radio"
                name="profile-visibility"
                value={profile.value}
                checked={selected}
                onChange={() => onSelect(profile.value)}
                onClick={() => onSelect(profile.value)}
                className="peer sr-only"
                aria-describedby={`${profile.value}-description`}
            />
            <div className="flex h-full flex-col items-center rounded-[24px] border border-white/12 bg-[#121212] pb-[clamp(10px,4.3dvh,32px)] transition-colors duration-300 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[6px] peer-focus-visible:outline-white hover:bg-[#181818] sm:rounded-[32px] motion-reduce:transition-none">
                <motion.div
                    aria-hidden="true"
                    initial={false}
                    animate={{
                        opacity: selected ? 1 : 0,
                        scale: reduceMotion || selected ? 1 : 0.985,
                    }}
                    transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="pointer-events-none absolute inset-0 z-10 rounded-[24px] border-[5px] border-white sm:rounded-[32px]"
                />
                <motion.span
                    aria-hidden="true"
                    animate={{ backgroundColor: selected ? "#FFFFFF" : "#FFFFFF00", borderColor: selected ? "#FFFFFF" : "#737880" }}
                    transition={{ duration: reduceMotion ? 0 : 0.25 }}
                    className="absolute right-3 top-3 z-10 h-4 w-4 rounded-full border-[1.5px] sm:right-[22px] sm:top-[33px] sm:h-5 sm:w-5"
                />
                <Illustration selected={selected} activation={activation} active={!isSaving && (hovered || focused)} />
                <span className="text-[clamp(15px,3.1dvh,23px)] font-medium leading-snug tracking-[-0.025em]">{profile.title}</span>
                <span id={`${profile.value}-description`} className="mt-2 max-w-[264px] px-2 text-center text-xs leading-normal text-[#B0B2B8] sm:text-sm">
                    {profile.description}
                </span>
            </div>
        </motion.label>
    );
}

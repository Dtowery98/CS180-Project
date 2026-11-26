"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { ProfileOptionCard, type Visibility } from "./profile-option-card";

const profiles = [
    { value: "public", title: "Public profile", description: "Other UCR students can discover and view your profile." },
    { value: "private", title: "Private profile", description: "Only approved followers can view your profile details." },
] satisfies { value: Visibility; title: string; description: string }[];

export function ProfileVisibilityForm() {
    const router = useRouter();
    const [visibility, setVisibility] = useState<Visibility | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [activations, setActivations] = useState({ public: 0, private: 0 });
    const currentSelection = useRef<Visibility | null>(null);

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
        <form onSubmit={confirmProfile} className="mt-[clamp(8px,2.7dvh,20px)] flex min-h-0 flex-1 flex-col items-center justify-start gap-[clamp(8px,4dvh,32px)]">
            <fieldset aria-describedby="privacy-description" disabled={isSaving} className="min-h-0 w-full max-w-[740px]">
                <legend className="sr-only">Profile visibility</legend>
                <div className="grid grid-cols-2 justify-items-center gap-3 sm:gap-8 md:gap-[88px]">
                    {profiles.map((profile) => (
                        <ProfileOptionCard
                            key={profile.value}
                            profile={profile}
                            selected={visibility === profile.value}
                            activation={activations[profile.value]}
                            isSaving={isSaving}
                            onSelect={activateProfile}
                        />
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
    );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ClubCircle from "@/components/onboardingNav/clubCircle";
import OnboardingNavbar from "@/components/onboardingNav/onboardingNav";
import SearchBar from "@/components/ui/searchBar";
import Button from "@/components/ui/button";

export default function OnboardingPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClubs, setSelectedClubs] = useState<string[]>([]);

    function toggleClub(club: string) {
        setSelectedClubs((previous) =>
            previous.includes(club)
                ? previous.filter((name) => name !== club)
                : [...previous, club]
        );
    }

    return (
        <main className="flex h-dvh w-full flex-col overflow-hidden bg-[#050505] p-4 sm:px-8 sm:py-5">
            <div className="w-full shrink-0 sm:h-10">
                <OnboardingNavbar currentStep={3} totalSteps={5} />
            </div>
            <section className="mx-auto flex min-h-0 w-full max-w-[690px] flex-1 flex-col items-center gap-2 text-center">
                <div className="shrink-0">
                    <h1 className="text-[clamp(2rem,5vh,3.625rem)] font-light leading-tight text-gray-50">Pick clubs</h1>
                    <p className="mt-1 text-sm text-[#B0B2B8] sm:text-lg">Choose the communities you want to be part of.</p>
                </div>
                <SearchBar onQueryChange={setSearchQuery} className="w-full max-w-[520px] shrink-0" />
                <ClubCircle searchQuery={searchQuery} selectedClubs={selectedClubs} onToggleClub={toggleClub} />
                <Button
                    text={selectedClubs.length
                        ? `Continue with ${selectedClubs.length} ${selectedClubs.length === 1 ? "club" : "clubs"}`
                        : "Select a club to continue"}
                    disabled={selectedClubs.length === 0}
                    onClick={() => router.push("/")}
                    className={`mx-auto flex min-h-12 w-full max-w-[520px] shrink-0 items-center justify-center rounded-full border border-[#2A2A2A] px-4 py-3 text-base sm:text-xl disabled:cursor-default ${selectedClubs.length ? "bg-[#F5F7FA] text-[#050505]" : "bg-[#121212] text-[#F9FAFB]"}`}
                />
            </section>
        </main>
    );
}

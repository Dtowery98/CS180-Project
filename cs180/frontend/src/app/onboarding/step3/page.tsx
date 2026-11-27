"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ClubCircle from "@/components/onboardingNav/clubCircle";
import OnboardingNavbar from "@/components/onboardingNav/onboardingNav";
import SearchBar from "@/components/ui/searchBar";
import Button from "@/components/ui/button";
import { getClubOptions, getMyClubIds, saveMyClubs } from "./actions";
import type { ClubOption } from "@/services/types";

export default function OnboardingPage() {
    const router = useRouter();
    const [allClubs, setAllClubs] = useState<ClubOption[]>([]);           // all 540 clubs
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClubs, setSelectedClubs] = useState<string[]>([]);    // picked club names
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // On page load: get every club, and mark the ones this student already picked
    useEffect(() => {
        Promise.all([getClubOptions(), getMyClubIds()]).then(([clubs, myIds]) => {
            setAllClubs(clubs);
            setSelectedClubs(clubs.filter((club) => myIds.includes(club.id)).map((club) => club.name));
        });
    }, []);

    // Clubs whose name contains the search text; the circle shows the first 6
    const query = searchQuery.trim().toLowerCase();
    const matches = allClubs.filter((club) => club.name.toLowerCase().includes(query));
    const visibleClubs = matches.slice(0, 6).map((club) => club.name);

    function toggleClub(club: string) {
        setSelectedClubs((previous) =>
            previous.includes(club)
                ? previous.filter((name) => name !== club)
                : [...previous, club]
        );
    }

    async function handleContinue() {
        setSaving(true);
        setError("");
        // the circle works with names; the database needs ids
        const ids = allClubs.filter((club) => selectedClubs.includes(club.name)).map((club) => club.id);
        const result = await saveMyClubs(ids);
        setSaving(false);
        if (result.error) {
            setError(result.error);
            return;
        }
        router.push("/onboarding/step4");
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
                <ClubCircle
                    clubs={visibleClubs}
                    totalMatches={matches.length}
                    searchQuery={searchQuery}
                    selectedClubs={selectedClubs}
                    onToggleClub={toggleClub}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button
                    text={saving
                        ? "Saving..."
                        : selectedClubs.length
                            ? `Continue with ${selectedClubs.length} ${selectedClubs.length === 1 ? "club" : "clubs"}`
                            : "Select a club to continue"}
                    disabled={selectedClubs.length === 0 || saving}
                    onClick={handleContinue}
                    className={`mx-auto flex min-h-12 w-full max-w-[520px] shrink-0 items-center justify-center rounded-full border border-[#2A2A2A] px-4 py-3 text-base sm:text-xl disabled:cursor-default ${selectedClubs.length ? "bg-[#F5F7FA] text-[#050505]" : "bg-[#121212] text-[#F9FAFB]"}`}
                />
            </section>
        </main>
    );
}

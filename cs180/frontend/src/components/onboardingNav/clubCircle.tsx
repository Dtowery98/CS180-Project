"use client";
import Button from "@/components/ui/button";
type ClubCircleProps = {
    searchQuery?: string;
    selectedClubs: string[];
    onToggleClub: (club: string) => void;
};

function ClubCircle({ searchQuery = "", selectedClubs, onToggleClub }: ClubCircleProps){
     const clubs = ["Computer Science", "Robotics Club", "Debate Club", "Art Club", "Music Club", "Drama Club"]
     const query = searchQuery.trim().toLowerCase();
     const matchingClubs = clubs.filter((club) => club.toLowerCase().includes(query));

    function highlightMatch(club: string) {
        if (!query) return club;
        const parts = [];
        let start = 0;
        let match = club.toLowerCase().indexOf(query);

        while (match !== -1) {
            parts.push(club.slice(start, match));
            parts.push(
                <mark key={match} className={`${selectedClubs.includes(club) ? "bg-[#3399FF]" : "bg-[#73BBFF]"} text-black`}>
                    {club.slice(match, match + query.length)}
                </mark>
            );
            start = match + query.length;
            match = club.toLowerCase().indexOf(query, start);
        }
        parts.push(club.slice(start));
        return <span>{parts}</span>;
    }

    return(
        <>
        <div className="grid min-h-0 w-full flex-1 place-items-center [container-type:size]">
        <div className="relative w-[min(100cqw,100cqh,560px)] aspect-square mx-auto [container-type:inline-size]">{
            clubs.map((club, index) => {
                if (!matchingClubs.includes(club)) return null;
                const angle = (index * 60 - 90) * Math.PI / 180;
                return (
                    <div
                        key={club}
                        className="absolute -translate-x-1/2 -translate-y-1/2 w-[36%] h-[36%] hover:z-10"
                        style={{
                            left: `${50 + Math.cos(angle) * 32}%`,
                            top: `${50 + Math.sin(angle) * 32}%`,
                        }}
                    >
                        <Button
                            text={highlightMatch(club)}
                            onClick={() => onToggleClub(club)}
                            className={`w-full h-full rounded-full ${selectedClubs.includes(club) ? "bg-[#73BBFF]" : "bg-gray-50"} text-black text-[clamp(0.625rem,4.2cqw,1.25rem)] leading-tight px-[10%] flex items-center justify-center`}
                        />
                    </div>
                );
            })
        }
        </div>
        </div>
        <h6 aria-live="polite" className="flex w-full shrink-0 flex-col justify-center text-sm text-[#B0B2B8] sm:text-base">
            {matchingClubs.length === 1
                ? "found only one result"
                : `found ${matchingClubs.length} results`}
        </h6>
        </>
    )
}

export default ClubCircle;

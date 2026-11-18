"use client";

import {useEffect, useState} from "react";
import SearchBar from "@/components/ui/searchBar";

import {
    searchSections,
    addSection,
    removeSection,
    getMySections,
    type SectionResult,
}
    from "@/app/onboarding/step2/actions";

    // string that identifies a section , ex "202640-39240"
    const keyOf = (termCode: string, crn: string) => `${termCode}-${crn}`;


    //formats time to non military
    function formatTime(time: string | null){

        if (!time) return "TBA"
        const [h,m] = time.split(":").map(Number);
        const suffix = h >=12 ? "PM" : "AM"
        return `${h%12 || 12}:${m.toString().padStart(2,"0")} ${suffix}`


    }
    

    export default function ClassSearch({onSavedChange}: {onSavedChange?: (sections:SectionResult[]) => void}) 
 {
        const [results, setResults] = useState<SectionResult[]>([]);
        const [saved, setSaved] = useState<SectionResult[]>([]);
        const [error, setError] = useState("");

        useEffect(() => {
     getMySections().then(setSaved);
   }, []);
   useEffect(() => {
     onSavedChange?.(saved);
   }, [saved, onSavedChange]);

        async function handleSearch(query: string) {
            setError("");
            setResults (await searchSections(query)
        );
            
        }
         const isSavedSection = (s: SectionResult) =>
     saved.some((x) => keyOf(x.term_code, x.crn) === keyOf(s.term_code, s.crn));

        async function toggle(section: SectionResult) {
            const key = keyOf(section.term_code, section.crn);
            const isSaved = isSavedSection(section);

            const result = isSaved
                ? await removeSection(section.term_code, section.crn)
                : await addSection(section.term_code, section.crn);

            if (result.error) {
                setError(result.error);
                return;
            }

            setSaved((prev) =>
  isSaved
    ? prev.filter((x) => keyOf(x.term_code, x.crn) !== key)  // remove this class
    : [...prev, section]                                      // add this class
);
        }
        return (
    <div className="w-full max-w-2xl">
      <SearchBar placeholder="Search classes, e.g. CS 180" onSearch={handleSearch} />

      {error && <p className="mt-2 text-red-500">{error}</p>}

      <ul className="mt-4 flex flex-col gap-2">
        {results.map((s) => {
          const isSaved = isSavedSection(s);
          return (
            <li key={keyOf(s.term_code, s.crn)}>
              <button
                type="button"
                onClick={() => toggle(s)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-white ${
                  isSaved ? "border-[#F5F7FA] bg-[#1F1F1F]" : "border-[#2A2A2A] bg-[#121212]"
                }`}
              >
                <div className="flex justify-between">
                  <span className="font-semibold">
                    {s.course_code} · {s.class_type} {s.section}
                  </span>
                  <span className="text-sm text-[#A3A3A3]">{isSaved ? "Added ✓" : "Add"}</span>
                </div>
                <p className="text-sm text-[#A3A3A3]">{s.courses?.title}</p>
                {s.meetings.map((m, i) => (
                  <p key={i} className="text-sm text-[#A3A3A3]">
                    {m.days?.join(", ") ?? "TBA"} · {formatTime(m.start_time)}–{formatTime(m.end_time)}
                    {m.building ? ` · ${m.building} ${m.room ?? ""}` : ""}
                  </p>
                ))}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
    }
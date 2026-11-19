"use client";
// src/app/onboarding/step2.tsx
import OnboardingNavbar from "@/components/onboardingNav/onboardingNav";
import Button from "@/components/ui/button";
import SearchBar from "@/components/ui/searchBar";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Calendar, { CalendarEvent } from "@/components/ui/calendar";
// keep your existing imports for OnboardingNavbar and SearchBar

export default function Step2Page() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const router = useRouter();

  return (
    <main className="p-8 bg-[#050505] min-h-screen">
      <OnboardingNavbar currentStep={2} totalSteps={5} />
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-7xl font-light text-white">Make Your Schedule</h1>
      </div>
      <div className="flex flex-col items-center gap-4 mt-8">
        <SearchBar
          placeholder="Search students or classes"
          onSearch={(q) => console.log("searching for", q)}
          className="max-w-md"
        />
      </div>
      <div className="flex justify-center mt-8 gap-4">
        <Calendar events={events} onEventsChange={setEvents} />
      </div>
      <div className="flex justify-center mt-8 gap-4">
        <button
          type="button"
          disabled={events.length === 0}
          onClick={() => router.push("/onboarding/step3")}
          className="h-[60px] w-[30vw] cursor-pointer rounded-full bg-[#F5F7FA] text-xl text-[#050505] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Done!
        </button>
      </div>
    </main>
  );
}
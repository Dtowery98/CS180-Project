"use client";
// src/app/onboarding/step2.tsx
import OnboardingNavbar from "@/components/onboardingNav/onboardingNav";
import Calendar from "@/components/ui/calendar";
import ClassSearch from "@/components/classSearch/classSearch";
import { useState } from "react";
import type { SectionResult } from "@/services/types";
import { sectionsToEvents } from "@/utils/schedule";

export default function OnboardingPage() {
     const [mySections, setMySections] = useState<SectionResult[]>([]);
  return (
    <main className="p-8 bg-[#050505] min-h-screen">
      <OnboardingNavbar currentStep={2} totalSteps={5} />
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-7xl font-light text-white">Make Your Schedule</h1>
        </div>
        <div className="flex flex-col items-center gap-4 mt-8">
          <ClassSearch onSavedChange={setMySections} />
        </div>
        <div className="flex justify-center mt-8 gap-4">
            <Calendar extraEvents={sectionsToEvents(mySections)} />
        </div>

    </main>
  );
}

/* To NAVIGATE FROM a mouse click or button click */

//   import Link from "next/link";
//   <Link href="/onboarding">Go to onboarding</Link>

/* To send to another site/page */

// "use client";
// import { useRouter } from "next/navigation";

// const router = useRouter();
// // ...after login succeeds:
// router.push("/dashboard");
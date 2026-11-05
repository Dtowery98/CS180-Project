"use client";
// src/app/onboarding/step2.tsx
import OnboardingNavbar from "@/components/onboardingNav/onboardingNav";
import Button from "@/components/ui/button";
import Calendar from "@/components/ui/calendar";
import SearchBar from "@/components/ui/searchBar";
import { useRouter } from "next/dist/client/components/navigation";

export default function OnboardingPage() {
  return (
    <main className="p-8 bg-[#050505] min-h-screen">
      <OnboardingNavbar currentStep={2} totalSteps={5} />
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-7xl font-light text-white">Make Your Schedule</h1>
        </div>
        <div className="flex flex-col items-center gap-4 mt-8">
            <SearchBar placeholder="Search students or classes" 
            onSearch={(q) => console.log("searching for", q)} className="max-w-md"/>
        </div>
        <div className="flex justify-center mt-8 gap-4">
            <Calendar />
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
"use client";
// src/app/onboarding/step4.tsx
import OnboardingNavbar from "@/components/onboardingNav/onboardingNav";
import Button from "@/components/ui/button";
import { useRouter } from "next/dist/client/components/navigation";
import { useState } from "react";
import Avatar from "@/components/ui/avatar";
import SpeechBubble from "@/components/ui/speechBubble";
  
export default function OnboardingPage() {
    const [photo, setPhoto] = useState<string | null>(null);
  return (
    <main className="p-8 bg-[#050505] min-h-screen">
        <OnboardingNavbar currentStep={4} totalSteps={5} />
        <div className="flex flex-col items-center gap-4 mt-8">
          <h1 className="text-4xl text-white">What's your first impression?</h1>
        </div>
        <div className = "flex items-start justify-center gap-3 mt-36">
              <SpeechBubble/>
              {(<Avatar src={photo} size={146}/>)}
        </div>
        <div className="flex justify-center mt-48 gap-4">
          <Button text = "Continue!" href = "/onboarding/step5" className="h-[60px] w-[30vw] rounded-full bg-[#F5F7FA] text-xl text-[#050505]" />
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

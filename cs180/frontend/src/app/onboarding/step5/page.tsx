"use client";
// src/app/onboarding/step1.tsx
import OnboardingNavbar from "@/components/onboardingNav/onboardingNav";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { useRouter } from "next/dist/client/components/navigation";
import {useState} from "react"


export default function OnboardingPage() {
const [visibility, setVisibility] = useState<string | null>(null);

    return (
    <main className="p-8 bg-[#050505] min-h-screen">
      <OnboardingNavbar currentStep={1} totalSteps={5} />
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-7xl font-light text-white">One last thing beforeyou join R'Space</h1>
          <p className="text-4xl font-light text-white">Choose who can see your profile</p>
          <p className="text-2xl text-neutral-400">You can change this anytime.</p>
        </div>  
        <div className="flex flex-wrap justify-center gap-24 mt-8">
           <Card
                title="Public Profile"
                description="Other UCR students can discover and view your profile."
                selected={visibility === "public"}
                onSelectedChange={(on) => setVisibility(on ? "public" : null)}
            >
            </Card>

            <Card
                title="Private Profile"
                description="Only approved followers can view your profile details."
                selected={visibility === "private"}
                onSelectedChange={(on) => setVisibility(on ? "private" : null)}
            >
            </Card>
        </div>
      <div className="flex justify-center mt-8 gap-4">
          <Button text="You're Done!" href="" className="h-[60px] w-[30vw] rounded-full bg-[#F5F7FA] text-xl text-[#050505]" />
      </div>
    </main>
  );
}

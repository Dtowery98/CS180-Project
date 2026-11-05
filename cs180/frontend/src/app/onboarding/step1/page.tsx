"use client";
// src/app/onboarding/step1.tsx
import OnboardingNavbar from "@/components/onboardingNav/onboardingNav";
import PictureUpload from "@/components/pictureUpload/pictureUpload";
import Button from "@/components/ui/button";
import { useRouter } from "next/dist/client/components/navigation";
  
export default function OnboardingPage() {
  return (
    <main className="p-8 bg-[#050505] min-h-screen">
      <OnboardingNavbar currentStep={1} totalSteps={5} />
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-7xl font-light text-white">Say Cheese!</h1>
          <p className="text-2xl text-neutral-400">upload a photo</p>
        </div>
      <PictureUpload/>
      <div className="flex justify-center mt-8 gap-4">
          <Button text="Continue" href="/onboarding/step2" className="h-[60px] w-[30vw] rounded-full bg-[#F5F7FA] text-xl text-[#050505]" />
      </div>
      <div className="flex justify-center mt-4">
          <Button text="Skip" href="/onboarding/step2" className="h-[60px] w-[30vw] rounded-full bg-[#121212] text-xl text-[#F5F7FA]" />
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
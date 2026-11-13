"use client";
// src/app/onboarding/step1.tsx
import OnboardingNavbar from "@/components/onboardingNav/onboardingNav";
import PictureUpload from "@/components/pictureUpload/pictureUpload";
import Button from "@/components/ui/button";
  
export default function OnboardingPage() {
  return (
    <main className="flex h-dvh w-full flex-col overflow-hidden bg-[#050505] p-4 sm:px-8 sm:py-5">
      <div className="w-full shrink-0 sm:h-10">
        <OnboardingNavbar currentStep={1} totalSteps={5} />
      </div>
      <section className="mx-auto flex min-h-0 w-full max-w-[860px] flex-1 flex-col items-center gap-2 text-center">
        <div className="shrink-0">
          <h1 className="text-[clamp(2rem,6dvh,4.5rem)] font-light leading-tight text-white">Say Cheese!</h1>
          <p className="mt-1 text-base text-neutral-400 sm:text-xl">upload a photo</p>
        </div>
        <div className="flex min-h-0 w-full flex-1 items-center justify-center">
          <PictureUpload />
        </div>
        <div className="flex w-full max-w-[520px] shrink-0 flex-col gap-2">
          <Button text="Continue" href="/onboarding/step2" className="h-[clamp(44px,7dvh,60px)] w-full rounded-full bg-[#F5F7FA] text-base text-[#050505] sm:text-xl" />
          <Button text="Skip" href="/onboarding/step2" className="h-[clamp(44px,7dvh,60px)] w-full rounded-full bg-[#121212] text-base text-[#F5F7FA] sm:text-xl" />
        </div>
      </section>
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

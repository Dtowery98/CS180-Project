// src/app/onboarding/page.tsx
import PictureUpload from "@/components/pictureUpload/pictureUpload";

export default function OnboardingPage() {
  return (
    <main className="p-8">
      <PictureUpload/>
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
import OnboardingNavbar from "@/components/onboardingNav/onboardingNav";
import { ProfileVisibilityForm } from "@/components/profile-visibility/profile-visibility-form";

export default function ProfileSwitch() {
    return (
        <main className="flex h-dvh w-full flex-col overflow-hidden bg-[#050505] px-4 pb-[clamp(12px,3dvh,28px)] text-[#F9FAFB] sm:px-6 [&_ol]:max-w-[552px]">
            <div className="h-16 w-full shrink-0 sm:h-[clamp(48px,8dvh,64px)]">
                <OnboardingNavbar currentStep={5} totalSteps={5} />
            </div>

            <section aria-labelledby="privacy-heading" className="mx-auto flex min-h-0 w-full max-w-[740px] flex-1 flex-col">
                <div className="shrink-0 text-center">
                    <h1 id="privacy-heading" className="text-[clamp(22px,5.4dvh,40px)] font-normal leading-[1.2] tracking-[-0.025em]">
                        One last thing before<br className="hidden sm:block" /> you join R’Space
                    </h1>
                    <p id="privacy-description" className="mt-[clamp(4px,1.6dvh,12px)] text-[clamp(14px,2.8dvh,21px)] leading-snug">
                        Choose who can see your profile
                    </p>
                    <p className="mt-1 text-[clamp(12px,2dvh,15px)] leading-snug text-[#999EA6]">You can change this anytime.</p>
                </div>

                <ProfileVisibilityForm />
            </section>
        </main>
    );
}

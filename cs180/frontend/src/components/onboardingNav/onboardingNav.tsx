// src/components/onboarding/onboardingNavbar.tsx

type OnboardingNavbarProps = {
  currentStep: number; // which step the user is on, starting at 1
  totalSteps?: number; // defaults to 5
};

export default function OnboardingNavbar({
  currentStep,
  totalSteps = 5,
}: OnboardingNavbarProps) {
  return (
    // The whole navbar: a row (flex) with 3 parts: logo | bars | spacer
    <header className="flex w-full items-start">
        
      {/*LOGO */}
      <div className="w-[140px] shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/rspace-logo.svg" alt="R'Space" width={140} height={94} />
      </div>

      {/* MIDDLE: fills leftover space and centers the bars */}
      <div className="flex flex-1 justify-center px-6 ">
        <ol
          aria-label={`Step ${currentStep} of ${totalSteps}`}
          className="flex w-full max-w-[740px] gap-[15px]"
        >
          {Array.from({ length: totalSteps }, (_, i) => (
            <li
              key={i}
              aria-current={i + 1 === currentStep ? "step" : undefined}
              className={`h-[5px] flex-1 rounded-full ${
                i < currentStep ? "bg-[#F5F7FA]" : "bg-[#303033]"
              }`}
            />
          ))}
        </ol>
      </div>

      {/* RIGHT: invisible spacer, same width as the logo, keeps bars centered */}
      <div className="w-[140px] shrink-0" aria-hidden="true" />
    </header>
  );
}
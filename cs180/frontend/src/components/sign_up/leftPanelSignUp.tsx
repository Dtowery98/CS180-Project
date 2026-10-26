import Spinner from "@/components/login/peopleSpin"

const LeftPanelSignUp = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-black px-5 py-5 text-white md:px-8">
        {/* Logo */}
        <div className="flex flex-col items-start">
            <img
            src="/rSpaceLogo.svg"
            alt="R'Space logo"
            className="h-auto w-24 object-contain"
            />
            <h1 className="text-[#A3A3A3]">
            Made by BARD
            </h1>
        </div>

        {/* Heading and people */}
        <div className="mx-auto mt-10 flex w-full max-w-md flex-col items-center">
            <h1 className="text-center text-5xl font-normal leading-tight tracking-tight md:text-5xl translate-y--10">
                Find people in your
                <br />
                R’Space Circle
            </h1>
            <div className="mt-4 flex w-full justify-center -translate-y-3">
                <Spinner>
                </Spinner>
            </div>
        </div>
        <h1 className="text-[#D4D4D4] text-center text-[20px] sm:text-[20px] md:text-[22px] lg:text-[25px] xl:text-[25px]">
            your circle is waiting
        </h1>
    </div>
  );
};

export default LeftPanelSignUp;

const BubbleCircle = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-black px-5 py-5 text-white md:px-8">

      {/* Logo */}
      <div className="flex items-start">
        <img
          src="/rSpaceLogo.svg"
          alt="R'Space logo"
          className="h-auto w-24 object-contain"
        />
      </div>

      {/* Heading and people */}
      <div className="mx-auto mt-10 flex w-full max-w-md flex-col items-center">

        <h1 className="text-center text-5xl font-normal leading-tight tracking-tight md:text-5xl">
          Find people in your
          <br />
          R’Space Circle
        </h1>

        {/* People illustration */}
        <div className="mt-4 flex w-full justify-center">
          <img
            src="/Circular-visual-01.svg"
            alt="People in the R'Space community"
            className="h-auto w-full max-w-[150px] object-contain"
          />
        </div>

      </div>
    </div>
  );
};

export default BubbleCircle;

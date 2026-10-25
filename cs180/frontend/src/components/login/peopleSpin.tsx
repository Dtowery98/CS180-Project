const people = [
  "/Circular-visual-01.svg",
  "/Circular-visual-02.svg",
  "/Circular-visual-03.svg",
  "/Circular-visual-04.svg",
  "/Circular-visual-05.svg",
  "/Circular-visual-06.svg"
]

const PeopleSpin = () => {
    const radius = 130;
    const imageSize = 110;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[350px]">

      {/* This is the shared center of the orbit */}
      <div className="absolute left-1/2 top-1/2 h-0 w-0">

        {/* Rotate the entire orbit around the shared center */}
        <div className="animate-[spin_60s_linear_infinite]">

          {people.map((person, index) => {
            const angle = (index * 360) / people.length;

            return (
                <div
                key={person}
                className="absolute"
                style={{
                    width: imageSize,
                    height: imageSize,
                    left: -imageSize / 2,
                    top: -imageSize / 2,
                    transform: `rotate(${angle}deg) translateY(-${radius}px)`,
                }}
                >
                {/* Counter-rotate the image to keep it upright */}
                <div
                    className="h-full w-full"
                >
                    <img
                    src={person}
                    alt={`Person ${index + 1}`}
                    className="h-full w-full rounded-full object-cover"
                    />
                </div>
                </div>
            );
            })}

        </div>
      </div>
    </div>
  );
}

export default PeopleSpin;
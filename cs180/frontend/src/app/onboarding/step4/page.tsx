"use client";

const ProfileSelection = () => {
    return(
         <div className="overflow-hidden h-screen relative">
             {/* Logo */}
        <div className="flex flex-col items-start p-4 absolute top-0 left-0">
            <img
            src="/rSpaceLogo.svg"
            alt="R'Space logo"
            className="h-auto w-24 object-contain"
            />
            <h1 className="text-[#A3A3A3]">
            Made by BARD
            </h1>
        </div>
         <div className="mx-auto mt-20 flex w-full max-w-4xl text-center flex-col items-center">
           <h1 className= "text-5xl font-normal leading-tight tracking-tight">One last thing before
you join R’Space</h1>
</div>
</div>
    )
}

export default ProfileSelection;
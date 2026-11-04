"use client";
import { PinInput } from "@/components/base/input/pin-input";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
const  Verification = () => {
    const router = useRouter();
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
           <h1 className= "text-5xl font-normal leading-tight tracking-tight">Enter the confirmation code</h1>
           <h1 className= "text-3xl text-gray-500">To verify you’re a UCR student, enter the 6-digit code
            we sent to scotty@ucr.edu</h1>
        <div className ="mt-10">
        <PinInput>
            <PinInput.Group maxLength={6}>
                <PinInput.Slot index={0}className=" bg-[#121212] text-white border-[#262626] placeholder: text-white" />
                <PinInput.Slot index={1}className=" bg-[#121212] text-white border-[#262626] placeholder: text-white" />
                <PinInput.Slot index={2}className=" bg-[#121212] text-white border-[#262626] placeholder: text-white" />
                <PinInput.Slot index={3} className=" bg-[#121212] text-white border-[#262626] placeholder: text-white" />
                <PinInput.Slot index={4}className=" bg-[#121212] text-white border-[#262626] placeholder: text-white" />
                <PinInput.Slot index={5} className=" bg-[#121212] text-white border-[#262626] placeholder: text-white"/>
            </PinInput.Group>
        </PinInput>
        </div>
        </div>
             <div className="relative flex w-full flex-col bg-black px-5 py-5 text-white md:px-8">
       
        <div className="mx-auto flex-col flex items-center mt-8">
             <Button
                    text="Next"
                    onClick={() => router.push("/verification")}
                    className="bg-[#F5F5F5] text-[#121212] px-6 py-3 hover:bg-gray-400
                    w-[30vw] h-[10vh] text-2xl rounded-full">
                </Button>
             <Button
                    text="I didn’t get the code"
                    onClick={() => router.push("/sign_up")}
                    className="bg-[#121212] text-[#F5F5F5] px-6 py-3 hover:bg-gray-400
                    border-[#838383] border-2 border-solid
                    w-[30vw] h-[10vh] text-2xl rounded-full mt-4">
                </Button>
        </div>
        </div>
        </div>
    );
};
export default Verification;
"use client";

import LeftSide from "@/components/login/defaultPanel"
import InputBox from "@/components/ui/singleLineTextBox"
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Login = () => {
    const router = useRouter();

  return (
    <div className="flex h-screen w-screen bg-[#050505]">
        <div className="w-[50vw]">
            <LeftSide>
            </LeftSide>
        </div>
        <div className="flex flex-col items-center justify-center -translate-x-4 w-1/2 bg-black">
            <h1 className="text-[#D4D4D4] text-center text-[20px] sm:text-[20px] md:text-[22px] lg:text-[25px] xl:text-[25px]">
                Log in with ucr email
            </h1>
            <div className="flex flex-col items-center justify-center">
                <InputBox 
                    placeholder="Email" 
                    className="mx-auto block text-[#A3A3A3] text-3xl bg-[#121212] 
                    w-[30vw] h-[10vh] border-2 border-solid border-[#2A2A2A] rounded-xl">
                </InputBox>
                <InputBox 
                    placeholder="Password" 
                    className="mx-auto block text-[#A3A3A3] text-3xl bg-[#121212] 
                    w-[30vw] h-[10vh] border-2 border-solid border-[#2A2A2A] rounded-xl">
                </InputBox>
                <Button
                    text="Log in"
                    onClick={() => router.push("/")}
                    className="bg-[#F5F5F5] text-[#121212] px-6 py-3 hover:bg-gray-400
                    w-[30vw] h-[10vh] text-2xl rounded-full">
                </Button>
                <Button
                    text="Forgot password?"
                    onClick={() => router.push("/")}
                    className="text-[#A3A3A3] hover:text-gray-400 text-2xl mt-3">
                </Button>
                <Button
                    text="Sign up"
                    onClick={() => router.push("/")}
                    className="bg-[#121212] text-[#F5F5F5] px-6 py-3 hover:bg-gray-400
                    border-[#838383] border-2 border-solid
                    w-[30vw] h-[10vh] text-2xl rounded-full mt-4">
                </Button>
            </div>
        </div>
    </div>
  );
};

export default Login;

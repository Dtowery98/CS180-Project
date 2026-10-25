"use client";

import LeftSide from "@/components/login/bubbleCircle"
import InputBox from "@/components/ui/singleLineTextBox"
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Login = () => {

  return (
    <div className="flex h-screen w-screen bg-[#050505]">
        <div className="w-[50vw]">
            <LeftSide>
            </LeftSide>
        </div>
        <div className="mt-20 w-[50vw] bg-black">
            <h1 className="text-[#D4D4D4] text-center text-[20px] sm:text-[20px] md:text-[22px] lg:text-[25px] xl:text-[25px]">
                Log in with ucr email
            </h1>
            <div className="justify-center">
                <InputBox 
                    placeholder="Email" 
                    className="text-[#A3A3A3] text-3xl bg-[#121212] 
                    w-[30vw] h-[10vh] border-2 border-solid border-[#2A2A2A] rounded-xl">
                </InputBox>
                <InputBox 
                    placeholder="Password" 
                    className="text-[#A3A3A3] text-3xl bg-[#121212] 
                    w-[30vw] h-[10vh] border-2 border-solid border-[#2A2A2A] rounded-xl">
                </InputBox>
            </div>
        </div>
    </div>
  );
};

export default Login;

"use client";

import { useState } from "react";
import LeftSide from "@/components/sign_up/leftPanelSignUp"
import InputBox from "@/components/ui/singleLineTextBox"
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";

const SignUp = () => {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

  return (

    
    <div className="flex h-screen shrink-0 w-full bg-[#050505] overflow-hidden">
        <div className="w-[50vw]">
            <LeftSide>
            </LeftSide>
        </div>
        <div className="flex flex-col items-center justify-center -translate-x-4 w-1/2 bg-black">
            <h1 className="text-[#D4D4D4] text-center text-[20px] sm:text-[20px] md:text-[22px] lg:text-[25px] xl:text-[25px]">
                Sign up with your UCR email
            </h1>
            <div className="flex flex-col items-center justify-center mt-4">
                <InputBox 
                    placeholder="Name" 
                    type="name"
                    value={name}
                    onChange={setName}
                    className="mx-auto block text-[#A3A3A3] text-3xl bg-[#121212] 
                    w-[30vw] h-[10vh] border-2 border-solid border-[#2A2A2A] rounded-xl">
                </InputBox>
                <InputBox 
                    placeholder="Email" 
                    type="email"
                    value={email}
                    onChange={setEmail}
                    className="mx-auto block text-[#A3A3A3] text-3xl bg-[#121212] 
                    w-[30vw] h-[10vh] border-2 border-solid border-[#2A2A2A] rounded-xl">
                </InputBox>
                <InputBox 
                    placeholder="Password" 
                    type="password"
                    value={password}
                    onChange={setPassword}
                    className="mx-auto block text-[#A3A3A3] text-3xl bg-[#121212] 
                    w-[30vw] h-[10vh] border-2 border-solid border-[#2A2A2A] rounded-xl">
                </InputBox>
                <Button
                    text="Sign up"
                    onClick={() => router.push("/verification")}
                    className="bg-[#F5F5F5] text-[#121212] px-6 py-3 hover:bg-gray-400
                    w-[30vw] h-[10vh] text-2xl rounded-full">
                </Button>
                <Button
                    text="Already have an account?"
                    onClick={() => router.push("/login")}
                    className="text-[#A3A3A3] hover:text-gray-400 text-2xl mt-3">
                </Button>
            </div>
        </div>
    </div>
  );
};

export default SignUp;

"use client";
import {useActionState} from "react";
import LeftSide from "@/components/sign_up/leftPanelSignUp"
import InputBox from "@/components/ui/singleLineTextBox"
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {signup} from "./actions";

const SignUp = () => {
    const router = useRouter();
    const [state, formAction, pending] = useActionState(signup, {});

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
            <form action={formAction} className="flex flex-col items-center justify-center mt-4">
                <InputBox 
                placeholder="Name"
                    name="name" 
                    className="mx-auto block text-[#A3A3A3] text-3xl bg-[#121212] 
                    w-[30vw] h-[10vh] border-2 border-solid border-[#2A2A2A] rounded-xl">
                </InputBox>
                <InputBox
                placeholder="Email" 
                    name="email" 
                    className="mx-auto block text-[#A3A3A3] text-3xl bg-[#121212] 
                    w-[30vw] h-[10vh] border-2 border-solid border-[#2A2A2A] rounded-xl">
                </InputBox>
                <InputBox 
                    
                    name="password"
                    placeholder="Password" 
                    className="mx-auto block text-[#A3A3A3] text-3xl bg-[#121212] 
                    w-[30vw] h-[10vh] border-2 border-solid border-[#2A2A2A] rounded-xl">
                </InputBox>
                {state.error && <p className="text-red-500 text-lg mt-2">{state.error}</p>}
                {state.message && <p className="text-green-400 text-lg mt-2">{state.message}</p>}
                <Button
                    
                    type="submit"
                    disabled={pending}
                    text={pending ? "signing up." : "Sign Up"}
                   
                    className="bg-[#F5F5F5] text-[#121212] px-6 py-3 hover:bg-gray-400
                    w-[30vw] h-[10vh] text-2xl rounded-full">
                </Button>
                <Button
                    text="Already have an account?"
                    onClick={() => router.push("/login")}
                    className="text-[#A3A3A3] hover:text-gray-400 text-2xl mt-3">
                </Button>
            </form>
        </div>
    </div>
  );
};

export default SignUp;

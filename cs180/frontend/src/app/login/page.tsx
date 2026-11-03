"use client";
import {useActionState} from "react";
import LeftSide from "@/components/login/leftPanelLogin"
import InputBox from "@/components/ui/singleLineTextBox"
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {login} from "./actions";

const Login = () => {
    const router = useRouter();
    const [state,formAction, pending] = useActionState(login, {});

  return (
    <div className="flex h-screen shrink-0 w-full bg-[#050505] overflow-hidden">
        <div className="w-[50vw]">
            <LeftSide>
            </LeftSide>
        </div>
        <div className="flex flex-col items-center justify-center -translate-x-4 w-1/2 bg-black">
            <h1 className="text-[#D4D4D4] text-center text-[20px] sm:text-[20px] md:text-[22px] lg:text-[25px] xl:text-[25px]">
                Log in with UCR email
            </h1>
            <form action={formAction} className="flex flex-col items-center justify-center mt-4">
                <InputBox 
                name = "email"
                type="email"
                    placeholder="Email" 
                    className="mx-auto block text-[#A3A3A3] text-3xl bg-[#121212] 
                    w-[30vw] h-[10vh] border-2 border-solid border-[#2A2A2A] rounded-xl">
                </InputBox>
                <InputBox 
                name = "password"
                type="password"
                    placeholder="Password" 
                    className="mx-auto block text-[#A3A3A3] text-3xl bg-[#121212] 
                    w-[30vw] h-[10vh] border-2 border-solid border-[#2A2A2A] rounded-xl">
                </InputBox>
                {state.error && <p className="text-red-500 text-lg mt-2">{state.error}</p>}
                <Button
                    type="submit"
                    disabled={ pending}
                    text={pending ? "Logging in." : "Log in"}
                 
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
                    onClick={() => router.push("/sign_up")}
                    className="bg-[#121212] text-[#F5F5F5] px-6 py-3 hover:bg-gray-400
                    border-[#838383] border-2 border-solid
                    w-[30vw] h-[10vh] text-2xl rounded-full mt-4">
                </Button>
            </form>
        </div>
    </div>
  );
};

export default Login;

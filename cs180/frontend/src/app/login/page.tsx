"use client";

import { useState } from "react";
import LeftSide from "@/components/login/leftPanelLogin"
import InputBox from "@/components/ui/singleLineTextBox"
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";

// login from .actions
import {login} from "./actions";

const Login = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setError("");

        try {
            const user = await login(email, password);

            if (user.error) {
                setError(user.error ?? "Something went wrong. Please try again.")
            }
        } catch {
            setError("Something went wrong. Please try again.");
        }
    };

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
            <form className="flex flex-col items-center justify-center mt-4">
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
                {error && (
                    <p className="text-red-500 mt-2">{error}</p>
                )}

                <Button
                    text="Log in"
                    onClick={handleLogin}
                    className="bg-[#F5F5F5] text-[#121212] px-6 py-3 hover:bg-gray-400
                    w-[30vw] h-[10vh] text-2xl rounded-full"
                />
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

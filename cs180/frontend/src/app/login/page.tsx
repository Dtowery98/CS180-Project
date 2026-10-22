"use client";

import LeftSide from "@/components/login/bubbleCircle"
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Login = () => {

  return (
    <div className="flex h-screen w-screen">
        <div className="w-[50vw] bg-slate-100">
            <LeftSide>
            </LeftSide>
        </div>
        <div className="w-[50vw] bg-black">
            <h1 className="text-white text-center text-[20px] sm:text-[25px] md:text-[25px] lg:text-[30px] xl:text-[30px]">
                Login in with ucr email
            </h1>
        </div>
    </div>
  );
};

export default Login;

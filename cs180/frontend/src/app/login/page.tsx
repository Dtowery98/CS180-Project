"use client";

import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Button
        text="here"
        onClick={() => router.push("/")}
      />
    </div>
  );
};

export default Login;

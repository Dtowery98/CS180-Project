"use client";

import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Landing = () => {
  const router = useRouter();

  return (
    <div>
      <Button
        text="LOGIN"
        onClick={() => router.push("/login")}
        className="bg-black text-white px-6 py-3 hover:bg-gray-800"
      />
    </div>
  );
};

export default Landing;

"use client";

import Login from "@/components/home/login";
import { useRef } from "react";

const Home = () => {
  const sections = Array.from({ length: 1 }, () => useRef(null));
  const components = [Login];

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {components.map((Component, index) => (
        <div
          key={index}
          className="flex items-center justify-center"
          // transition={{ duration: 0.8 + index * 0.1 }}
          ref={sections[index]}
        >
          <Component />
        </div>
      ))}
    </div>
  );
}

export default Home;
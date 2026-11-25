"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Calendar from "@/components/ui/calendar"
import SearchBar from "@/components/ui/searchBar";

export default function Discovery(){
    return(
        <div>
            <SearchBar className="justify-center items-center gap-3.5 "></SearchBar>
            <div className="flex ">
                 <Calendar></Calendar>
                 <div>
                <div>
                <h1 className="text-white text-center text-[40px] not-italic font-normal leading-[normal]">Your Circle</h1>
                 <div className="w-[471px] h-[555px] [background:#121212] rounded-[50px]"></div>
                </div>
                 </div>     
                       
        </div>
            <h1>Your Circle</h1>
            <div className="w-[308px] h-[45px] [background:#1A1A1A] rounded-[50px]">
             </div>
        </div>
    )
}
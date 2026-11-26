"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Calendar from "@/components/ui/calendar"
import SearchBar from "@/components/ui/searchBar";

export default function Discovery(){
    return(

        <div className="min-h-screen w-full px-4 pb-8 pt-4 sm:px-8">
            <div className="flex items-center justify-between gap-4">
                {/* Logo */}
                <div className="flex flex-col items-start">
                    <img src="/rSpaceLogo.svg" alt="R'Space logo" className="h-auto w-24 object-contain"/>
                    <h1 className="text-[#A3A3A3]">
                        Made by BARD
                    </h1>
                </div>
                <div className="inline-flex shrink-0 items-center gap-3 border [background:rgba(255,255,255,0.05)] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.40)] pl-2 pr-4 py-2 rounded-[999px] border-solid border-[rgba(255,255,255,0.10)]">
                    <div
                        className="size-[58px] shrink-0 bg-center bg-cover bg-no-repeat" style={{ backgroundImage: "url('/Circular-visual-01.svg')" }}/>
                    <h1 className="whitespace-nowrap text-gray-50 [text-shadow:0_1px_2px_rgba(0,0,0,0.50)] text-lg not-italic font-semibold leading-[normal]">
                        @joe who
                    </h1>
                </div>
            </div>
            <SearchBar className="mx-auto mt-8 max-w-md" />
            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
                <div className="min-w-0 [&>div]:max-w-none">
                    <Calendar />
                </div>
                <section className="min-w-0">
                    <h1 className="text-center text-3xl font-normal text-white sm:text-[40px]">Your Circle</h1>
                    <div className="mx-auto mt-2 h-[45px] w-full max-w-[308px] rounded-[50px] bg-[#1a1a1a]" />
                </section>
            </div>

        </div>
)
}

"use client";
import BannerCalendar from "@/components/discovery/bannerCalendar";
import DiscoveryCircle from "@/components/discovery/discoveryCircle";
import SearchBar from "@/components/ui/searchBar";

export default function Discovery() {
    return (
        <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#050505] px-4 py-3 sm:px-8 lg:px-[3.25vw] lg:pb-[calc(14*var(--frame-unit))] lg:pt-[calc(11*var(--frame-unit))] lg:[--frame-unit:min(0.069444vw,0.097656dvh)]">
            <header className="grid shrink-0 grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 md:grid-cols-[minmax(max-content,1fr)_minmax(0,520px)_minmax(max-content,1fr)]">
                {/* Logo */}
                <div className="flex flex-col items-start">
                    <img src="/rSpaceLogo.svg" alt="R'Space logo" className="h-auto w-20 object-contain lg:w-[clamp(80px,calc(140*var(--frame-unit)),112px)]" />
                    <p className="text-[11px] font-normal text-[#A3A3A3]">
                        Made by BARD
                    </p>
                </div>
                <SearchBar className="col-span-2 row-start-2 mx-auto max-w-md md:col-span-1 md:col-start-2 md:row-start-1 lg:max-w-[min(520px,calc(520*var(--frame-unit)))]" />
                <div className="col-start-2 row-start-1 inline-flex items-center gap-2.5 justify-self-end rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3.5 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.40)] md:col-start-3">
                    <img src="/Circular-visual-01.svg" alt="" className="size-9 shrink-0 rounded-full object-cover sm:size-11" />
                    <span className="whitespace-nowrap text-sm font-medium leading-none text-gray-50 sm:text-base">
                        @joe who
                    </span>
                </div>
            </header>
            <div className="mx-auto mt-3 grid min-h-0 w-full flex-1 grid-rows-[minmax(0,1.2fr)_minmax(0,1fr)] gap-3 lg:mt-[calc(17*var(--frame-unit))] lg:max-w-[calc(1220px+12*var(--frame-unit))] lg:grid-cols-[minmax(0,70fr)_minmax(0,52fr)] lg:grid-rows-[minmax(0,1fr)] lg:gap-[calc(12*var(--frame-unit))]">
                <BannerCalendar />
                <DiscoveryCircle />
            </div>
        </div>
    );
}

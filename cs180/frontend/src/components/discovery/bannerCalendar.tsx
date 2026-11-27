import Calendar from "@/components/ui/calendar";

export default function BannerCalendar() {
    return (
        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-3xl bg-[#121212] lg:rounded-[calc(50*var(--frame-unit))]">
            <div className="relative h-[min(273px,45%)] shrink-0 overflow-hidden [container-type:size] lg:h-[calc(273*var(--frame-unit))]">
                <div className="absolute inset-0">
                    <img src="/discovery/cover.png" alt="" className="size-full object-cover" />
                    <div
                        className="absolute inset-0"
                        style={{ backgroundImage: "linear-gradient(90deg, #000c 0%, #000a 46.154%, #0005 76.923%, transparent 100%)" }}
                    />
                </div>
                <img
                    src="/discovery/scotty-profile.png"
                    alt="Scotty"
                    className="absolute left-[10px] top-[14%] size-[55cqh]"
                />
                <div className="absolute bottom-[6%] left-[min(22px,8cqh)]">
                    <button type="button" className="flex h-[clamp(18px,17cqh,46px)] w-[clamp(52px,46cqh,126px)] items-center justify-center gap-1 rounded-full border border-white/35 bg-[#131313] text-[clamp(10px,6.6cqh,18px)] font-medium text-[#fafafa] shadow-[0_3px_12px_#0005]">
                        <img src="/discovery/add.svg" alt="" className="size-[clamp(12px,9cqh,24px)]" />
                        Add
                    </button>
                    <div className="mt-0.5 flex items-center gap-2">
                        <p className="text-[clamp(14px,13.2cqh,36px)] font-semibold leading-none text-white">@scotty</p>
                        <button type="button" className="h-[clamp(26px,16cqh,44px)] w-[clamp(68px,43cqh,116px)] shrink-0 rounded-full border border-[#4d4d52] bg-[#272729] text-[clamp(11px,6cqh,16px)] font-semibold text-[#fafafa]">
                            Profile
                        </button>
                    </div>
                </div>
            </div>
            <div className="min-h-0 flex-1 [color-scheme:dark]">
                <Calendar fillHeight />
            </div>
        </div>
    );
}

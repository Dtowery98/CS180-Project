import type { CalendarEvent } from "@/components/ui/calendar";
import type { SectionResult } from "@/app/onboarding/step2/actions";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
const COLORS = ["bg-teal-500", "bg-orange-500", "bg-red-500", "bg-lime-300 text-black", "bg-indigo-300 text-black"];

// "09:30:00" -> 9.5
function toHours(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
}

// 1 calendar event per classs meeting per weekday
export function sectionsToEvents(sections: SectionResult[]): CalendarEvent[] {
  return sections.flatMap((s, index) =>
    s.meetings.flatMap((m, i) => {
      if (!m.days || !m.start_time || !m.end_time) return []; // TBA / online: nothing to draw
      return m.days
        .filter((d): d is (typeof WEEKDAYS)[number] => (WEEKDAYS as readonly string[]).includes(d))
        .map((day) => ({
          id: `${s.term_code}-${s.crn}-${i}-${day}`,
          day,
          start: toHours(m.start_time!),
          end: toHours(m.end_time!),
          title: `${s.course_code} ${s.class_type ?? ""} ${s.section}`,
          location: m.building ? `${m.building} ${m.room ?? ""}` : undefined,
          color: COLORS[index % COLORS.length],
        }));
    })
  );
}
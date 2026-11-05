"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

// ---- Types ------------------------------------------------------------
type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

export interface CalendarEvent {
  id: string;
  day: Day;
  start: number; // 0–23, inclusive
  end: number;   // 1–24, exclusive (9–11 AM = start 9, end 11)
  title: string;
  location?: string;
  color: string;
}

interface Slot {
  day: Day;
  hour: number;
}

interface CalendarProps {
  initialEvents?: CalendarEvent[];
}

// ---- Layout constants -------------------------------------------------
const DAYS: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const firstHour = 6;
const HOURS: number[] = Array.from({ length: 24 - firstHour }, (_, i) => firstHour + i); // 6 AM ... 11 PM
const ROW_HEIGHT = 56;   // px per hour slot (matches h-14)
const VISIBLE_ROWS = 9; // only 10 slots visible at once    
const FOCUS_START = 7;   // 7 AM
const FOCUS_END = 20;    // 8 PM

const COLORS: string[] = [
  "bg-teal-500",
  "bg-orange-500",
  "bg-red-500",
  "bg-lime-300 text-black",
  "bg-indigo-300 text-black",
];

function formatHour(h: number): string {
  const h24 = h % 24; // so 24 (end of day) reads as 12 AM
  const suffix = h24 < 12 ? "AM" : "PM";
  const hour = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${hour}:00 ${suffix}`;
}

// ---- Component --------------------------------------------------------
export default function Calendar({ initialEvents = [] }: CalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [draft, setDraft] = useState<Slot | null>(null); // open form's slot
  const [endHour, setEndHour] = useState(1);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Center the 7 AM – 8 PM range in the visible window on first render.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const center = ((FOCUS_START + FOCUS_END) / 2) * ROW_HEIGHT;
    el.scrollTop = center - (VISIBLE_ROWS * ROW_HEIGHT) / 2;
  }, []);

  // A slot is taken if ANY event covers it, not just one starting there.
  const isOccupied = (day: Day, hour: number): boolean =>
    events.some((e) => e.day === day && hour >= e.start && hour < e.end);

  const overlaps = (day: Day, start: number, end: number): boolean =>
    events.some((e) => e.day === day && start < e.end && end > e.start);

  // Latest allowed end time: the next event's start that day, or midnight.
  function maxEndFor(slot: Slot): number {
    const nextStarts = events
      .filter((e) => e.day === slot.day && e.start > slot.hour)
      .map((e) => e.start);
    return nextStarts.length ? Math.min(...nextStarts) : 24;
  }

  function openSlot(day: Day, hour: number) {
    setDraft({ day, hour });
    setEndHour(hour + 1);
    setTitle("");
    setLocation("");
  }

  function saveEvent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!draft || !title.trim()) return;
    if (endHour <= draft.hour || overlaps(draft.day, draft.hour, endHour)) return;
    const slot = draft;
    setEvents((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        day: slot.day,
        start: slot.hour,
        end: endHour,
        title: title.trim(),
        location: location.trim() || undefined,
        color: COLORS[prev.length % COLORS.length],
      },
    ]);
    setDraft(null);
  }

  // End-time choices: one hour after the start, up to the next event.
  const endOptions: number[] = draft
    ? Array.from(
        { length: maxEndFor(draft) - draft.hour },
        (_, i) => draft.hour + 1 + i
      )
    : [];

  return (
    <div className="w-full max-w-5xl rounded-xl bg-black p-4 text-white">
      {/* Header row: "Time" + weekdays (stays fixed while the body scrolls) */}
      <div className="grid grid-cols-[80px_repeat(5,1fr)] border-b border-neutral-800 pb-2">
        <div className="text-sm text-neutral-500">Time</div>
        {DAYS.map((d) => (
          <div key={d} className="text-center font-semibold">
            {d}
          </div>
        ))}
      </div>

      {/* Scrollable body: exactly 10 rows tall */}
      <div
        ref={scrollRef}
        className="overflow-y-auto"
        style={{ height: VISIBLE_ROWS * ROW_HEIGHT }}
      >
        <div className="grid grid-cols-[80px_repeat(5,1fr)]">
          {/* Column 1: time labels */}
          <div>
            {HOURS.map((h) => (
              <div
                key={h}
                className="h-14 pr-2 pt-1 text-right text-xs text-neutral-400"
              >
                {formatHour(h)}
              </div>
            ))}
          </div>

          {/* Columns 2–6: weekday columns */}
          {DAYS.map((day) => (
            <div key={day} className="relative border-l border-neutral-800">
              {/* Layer 1: clickable hour slots */}
              {HOURS.map((hour) => {
                const taken = isOccupied(day, hour);
                return (
                  <button
                    key={hour}
                    type="button"
                    disabled={taken}
                    onClick={() => openSlot(day, hour)}
                    aria-label={`Add event ${day} ${formatHour(hour)}`}
                    className="block h-14 w-full border-t border-neutral-800 hover:bg-neutral-900 disabled:cursor-default disabled:hover:bg-transparent"
                  />
                );
              })}

              {/* Layer 2: events, positioned over the slots they cover */}
              {events
                .filter((ev) => ev.day === day)
                .map((ev) => (
                  <div
                    key={ev.id}
                    className={`absolute inset-x-1 overflow-hidden rounded-md px-2 py-1 text-xs leading-tight ${ev.color}`}
                    style={{
                      top: ev.start * ROW_HEIGHT + 4,
                      height: (ev.end - ev.start) * ROW_HEIGHT - 8,
                    }}
                  >
                    <div className="font-bold">{ev.title}</div>
                    <div>
                      {formatHour(ev.start)}–{formatHour(ev.end)}
                    </div>
                    {ev.location && <div>{ev.location}</div>}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* New-event form, opened by clicking a slot */}
      {draft && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setDraft(null)}
        >
          <form
            onSubmit={saveEvent}
            onClick={(e) => e.stopPropagation()}
            className="w-80 space-y-3 rounded-lg bg-neutral-900 p-5"
          >
            <h2 className="font-semibold">
              New event · {draft.day} {formatHour(draft.hour)}
            </h2>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (e.g. CS 101)"
              className="w-full rounded bg-neutral-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (e.g. Room 204)"
              className="w-full rounded bg-neutral-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
            />
            <label className="flex items-center justify-between text-sm">
              <span className="text-neutral-300">Ends</span>
              <select
                value={endHour}
                onChange={(e) => setEndHour(Number(e.target.value))}
                className="rounded bg-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
              >
                {endOptions.map((h) => (
                  <option key={h} value={h}>
                    {formatHour(h)} ({h - draft.hour} hr)
                  </option>
                ))}
              </select>
            </label>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="rounded px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded bg-teal-500 px-3 py-1.5 text-sm font-semibold text-black hover:bg-teal-400"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
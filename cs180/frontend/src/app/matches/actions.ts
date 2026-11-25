"use server";

import {createClient} from "@/utils/supabase/server";

// grid of monday through friday 8am to 8pm with 1 hr boxes.
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const FIRST_HOUR = 8;
const LAST_HOUR = 20;


export type Match = {
    id: string;
    full_name: string;
    sharedFreeHours: number;
    sharedFreeSlots: string[];
}



type Meeting = { days: string[] | null; start_time: string | null; end_time: string | null};

//1 row from query beloew

type Row = {
    student_id: string;
    profiles: {full_name: string} | null;
    sections: { meetings: Meeting[]} | null;
}

// converts time slot to hours

function toHours(time: string): number {
    const [h, m] = time.split(":").map(Number);
    return h + m / 60;
}

// converts a 1 hour box a student has class in as a string
function busySlots(meetings: Meeting[]): Set<string> {
    const busy = new Set<string>();
    for (const m of meetings) {
        if (!m.days || !m.start_time || !m.end_time) continue;
        const start = toHours(m.start_time);
        const end = toHours(m.end_time);
        for (const day of m.days) {
            for (let hour = FIRST_HOUR; hour < LAST_HOUR; hour++) {
                if ( hour < end && hour + 1 > start) busy.add(`${day}-${hour}`);
            }
        }
    }
    return busy;
}

// other students that share classes with the current user and how many hours they share
export async function getFreeTimeMatches(): Promise<Match[]> {

    const supabase = await createClient();
    const { data: { user }} = await supabase.auth.getUser();

    if (!user) return [];

    // query everyones saved sections, with names and meeting timers
    const { data, error} = await supabase
    .from("student_sections")
    .select(`
        student_id, 
        profiles( full_name ),
        sections (meetings(days, start_time,end_time))

    `);

    if(error) 
    {
        console.error("getFreeTimeMatches error:", error);
        return[];
    }

    // group the rows by student id{name, all meetings}
    const students= new Map<string, {name: string; meetings: Meeting[] }>();
    for (const row of data as unknown as Row[]){
        const entry = students.get(row.student_id) ?? {
            name: row.profiles?.full_name ?? "Unkown",
            meetings: [],
        };
        entry.meetings.push(...(row.sections?.meetings ?? []));
        students.set(row.student_id,entry);
    }
    const me = students.get(user.id);
    if(!me) return[]; //no saved clases
    const myBusy = busySlots(me.meetings);


    // compare other students to current user
  const matches: Match[] = [];
  for (const [id, other] of students) {
    if (id === user.id) continue;
    const theirBusy = busySlots(other.meetings);

    const shared: string[] = [];
    for (const day of DAYS) {
      for (let hour = FIRST_HOUR; hour < LAST_HOUR; hour++) {
        const slot = `${day}-${hour}`;
        if (!myBusy.has(slot) && !theirBusy.has(slot)) shared.push(slot);
      }
    }

    matches.push({ id, full_name: other.name, sharedFreeHours: shared.length, sharedFreeSlots: shared });
  }

  // top 10 of people with most free time
  return matches.sort((a, b) => b.sharedFreeHours - a.sharedFreeHours).slice(0, 10);
}
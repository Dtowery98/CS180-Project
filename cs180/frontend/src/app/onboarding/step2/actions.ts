"use server";

import {createClient} from "@/utils/supabase/server";

export type SectionResult={
    term_code: string;
    crn: string;
    course_code: string;
    section: string;
    class_type: string | null;
    instructors: string | null;
    courses: {title: string} | null;
    meetings: {
        days: string[] | null;
        start_time: string | null;
        end_time: string | null;
        building: string | null;
        room: string | null;
    }[];
};
export async function searchSections(query: string): Promise<SectionResult[]> {
    
    const search = query.trim().replace(/^([A-Za-z]+)\s*(\d)/, "$1 $2");
    const supabase = await createClient();
    const {data,error} = await supabase
        .from("sections")
        .select(
            `
            term_code,
            crn,
            course_code,
            section,
            class_type,
            instructors,
            courses(title),
            meetings(days, start_time, end_time, building, room)
            `
        )
        .ilike("course_code", `%${search}%`)
 
       .limit(10);

       if (error)
         {
        console.error("Error searching sections:", error);
        return [];
         }
       return data as unknown as SectionResult[];
        }

       //whats sent back to page
       type ActionResult = {error?: string}; 


       // save the section to the current users schedule

       export async function addSection(termCode: string, crn: string): Promise<ActionResult> {
       const supabase = await createClient();
       const {data: {user } } = await supabase.auth.getUser();
       
       if (!user) 
        {
          return {error: "please log in to add your sections"};
        }
        const {error} = await supabase
            .from("student_sections")
            .insert({student_id: user.id, term_code: termCode, crn: crn});
            
            
       if(error && error.code !=="23505")
        {
                console.error("addSection error:", error);
                return {error: "couldnt add section"};    
        }
            return {};
        }

        //remove section from current users schedule

        export async function removeSection(termCode: string, crn: string): Promise<ActionResult> {
            const supabase = await createClient();
            const {data: {user}} = await supabase.auth.getUser();
            
            if (!user) 
            {
                return {error: "please log in to remove your sections"};
            }

            const {error}=await supabase
                .from("student_sections")
                .delete()
                .eq("student_id", user.id)
                .eq("term_code", termCode)
                .eq("crn", crn);
            
            if (error) 
            {
                console.error("removeSection error:", error);
                return {error: "couldnt remove section"};
            }
            return {};

        }

        //sections currently saved by the current user
        export async function getMySections(): Promise<SectionResult[]>{
            const supabase = await createClient();
            const {data: {user}} = await supabase.auth.getUser();
            
            if (!user) 
            {
                return [];
            }

            const {data, error} = await supabase
                .from("student_sections")
                .select(`
                 sections (term_code, crn, course_code, section, class_type, instructors,
                courses ( title ),
                meetings ( days, start_time, end_time, building, room ))
    `)
                .eq("student_id", user.id);
            if (error) 
            {
                console.error("getMySections error:", error);
                return [];
            }
            
            return (data as unknown as {sections: SectionResult}[]).map((row) => row.sections);
        }

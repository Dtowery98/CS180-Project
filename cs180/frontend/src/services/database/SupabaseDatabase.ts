import { createClient } from "@/utils/supabase/server";
import type { IDatabase } from "./IDatabase";

import type {
    Profile,
    Club,
    SectionResult
} from "../types";

export class SupabaseDatabase implements IDatabase {
    async getProfile(userId: string): Promise<Profile | null> {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .maybeSingle();

        if (error) throw error;

        return data as Profile | null;
    }

    async getAllProfiles(): Promise<Profile[]> {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("profiles")
            .select("*");

        if (error) throw error;

        return data as Profile[];
    }

    async createProfile(profile: Profile): Promise<Profile> {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("profiles")
            .insert(profile)
            .select()
            .single();

        if (error) throw error;

        return data as Profile;
    }

    async searchSections(query: string): Promise<SectionResult[]> {
       const search = query.trim().replace(/^([A-Za-z]+)\s*(\d)/, "$1 $2");
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("sections")
            .select(`
                term_code,
                crn,
                course_code,
                section,
                class_type,
                instructors,
                courses(title),
                meetings(days, start_time, end_time, building, room)
            `)
            .ilike("course_code", `%${search}%`)
            .limit(10);

        if (error) throw error;

        return data as unknown as SectionResult[];
    }

    async addSection(
        userId: string,
        termCode: string,
        crn: string
    ): Promise<void> {
        const supabase = await createClient();

        const { error } = await supabase
            .from("student_sections")
            .insert({
                student_id: userId,
                term_code: termCode,
                crn: crn
            });

        // Match the behavior of the fake database:
        // adding an existing section does nothing.
        if (error && error.code !== "23505") {
            throw error;
        }
    }

    async removeSection(
        userId: string,
        termCode: string,
        crn: string
    ): Promise<void> {
        const supabase = await createClient();

        const { error } = await supabase
            .from("student_sections")
            .delete()
            .eq("student_id", userId)
            .eq("term_code", termCode)
            .eq("crn", crn);

        if (error) throw error;
    }

    async getMySections(userId: string): Promise<SectionResult[]> {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("student_sections")
            .select(`
                sections (
                    term_code,
                    crn,
                    course_code,
                    section,
                    class_type,
                    instructors,
                    courses(title),
                    meetings(days, start_time, end_time, building, room)
                )
            `)
            .eq("student_id", userId);

        if (error) throw error;

        return (data as unknown as { sections: SectionResult }[])
            .map(row => row.sections);
    }

    async getAllClubs(): Promise<Club[]> {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("clubs")
            .select("*");

        if (error) throw error;

        return data as Club[];
    }
        async setAvatar(userId: string, image: Buffer): Promise<string> {
        const supabase = await createClient();
        const path = `${userId}/avatar.png`;

        // Uploads new avatar replacing a old one if there is one
        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(path, image, { contentType: "image/png", upsert: true });
        if (uploadError) throw uploadError;

        //  gives each upload a new address so browsers don't show the old cached photo
        const { data } = supabase.storage.from("avatars").getPublicUrl(path);
        const avatarUrl = `${data.publicUrl}?v=${Date.now()}`;

        // reemember the address on the profile
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ avatar_url: avatarUrl })
            .eq("id", userId);
        if (updateError) throw updateError;

        return avatarUrl;
    }
}
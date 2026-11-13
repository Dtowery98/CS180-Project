import { createClient } from "@/utils/supabase/server";
import type { IDatabase } from "./IDatabase";
import type { Profile } from "../types";

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
}
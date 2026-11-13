import { createClient } from "@/utils/supabase/server";
import type { IAuthProvider } from "./IAuthProvider";
import type { AuthResult } from "../types";

export class SupabaseAuthProvider implements IAuthProvider {
    async login(email: string, password: string): Promise<AuthResult> {
        const supabase = await createClient();

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error || !data.user) {
            return {
                user: null,
                error: "Incorrect email or password"
            };
        }

        return {
            user: {
                id: data.user.id,
                email: data.user.email ?? email
            },
            error: null
        };
    }

    async signup(email: string, password: string): Promise<AuthResult> {
        const supabase = await createClient();

        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error || !data.user) {
            return {
                user: null,
                error: error?.message ?? "Unable to create account"
            };
        }

        return {
            user: {
                id: data.user.id,
                email: data.user.email ?? email
            },
            error: null
        };
    }
}
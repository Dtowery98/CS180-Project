"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import type { AuthState } from "@/services/types";
import { createAuthProvider, createDatabase } from "@/services/providers";
import { signupService } from "@/services/auth/authService";

export async function signup(
    email: string,
    password: string,
    fullName: string
): Promise<AuthState> {

    const auth = createAuthProvider();
    const db = createDatabase();

    const result = await signupService(
        auth,
        db,
        email,
        password,
        fullName
    );

    if (result.error) {
        return { error: result.error };
    }

    revalidatePath("/", "layout");
    redirect("/");
}
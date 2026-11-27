"use server";

import { revalidatePath } from "next/cache";

import { createAuthProvider, createDatabase } from "@/services/providers";
import { signupService } from "@/services/auth/authService";

import type { AuthResult } from "@/services/types";

export async function signup(
    email: string,
    password: string,
    fullName: string
): Promise<AuthResult> {

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
        return result;
    }

    revalidatePath("/", "layout");

    return result;
}
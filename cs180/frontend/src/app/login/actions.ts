"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createAuthProvider } from "@/services/providers";
import { loginService } from "@/services/auth/authService";

import type { AuthResult } from "@/services/types";

export async function login(
    email: string,
    password: string
): Promise<AuthResult> {

    const auth = createAuthProvider();

    const result = await loginService(auth, email, password);

    if (result.error) {
        return result;
    }

    revalidatePath("/", "layout");

    return result;
}
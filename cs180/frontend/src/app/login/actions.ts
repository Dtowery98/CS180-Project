"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import type { AuthState } from "@/services/types";
import { createAuthProvider } from "@/services/providers";
import { loginService } from "@/services/auth/authService";

export async function login(
    email: string,
    password: string
): Promise<AuthState> {

    const auth = createAuthProvider();

    const result = await loginService(auth, email, password);

    if (result.error) {
        return { error: result.error };
    }

    revalidatePath("/", "layout");
    redirect("/");
}
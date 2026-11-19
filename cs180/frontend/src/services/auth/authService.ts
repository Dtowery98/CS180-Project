import type { IAuthProvider } from "./IAuthProvider";
import type { IDatabase } from "../database/IDatabase";
import type { AuthResult } from "../types";

export async function loginService(
    auth: IAuthProvider,
    emailInput: string,
    password: string
): Promise<AuthResult> {

    const email = emailInput.trim().toLowerCase();

    if (!email || !password) {
        return {
            user: null,
            error: "Please fill all fields"
        };
    }

    return auth.login(email, password);
}

export async function signupService(
    auth: IAuthProvider,
    db: IDatabase,
    emailInput: string,
    password: string,
    fullName: string
): Promise<AuthResult> {

    const email = emailInput.trim().toLowerCase();
    const cleanFullName = fullName.trim();

    if (!email || !password || !cleanFullName) {
        return {
            user: null,
            error: "Please fill all fields"
        };
    }

    if (password.length < 8) {
        return {
            user: null,
            error: "Password must be at least 8 characters"
        };
    }

    const result = await auth.signup(email, password);

    if (result.error || !result.user) {
        return result;
    }

    try {
        await db.createProfile({
            id: result.user.id,
            email: result.user.email,
            full_name: cleanFullName
        });
    } catch {
        return {
            user: null,
            error: "Account created, but profile creation failed"
        };
    }

    return result;
}
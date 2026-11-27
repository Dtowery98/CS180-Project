import { cookies } from "next/headers";

import type { IAuthProvider } from "./IAuthProvider";
import type { AuthResult, User } from "../types";

const COOKIE_NAME = "fake-auth-user-id";

export class FakeAuthProvider implements IAuthProvider {

    // Stores email -> user and password
    private credentials: Map<string, { user: User; password: string }>;

    private nextUserId = 4;

    constructor() {
        this.credentials = new Map([
            [
                "student1@ucr.edu",
                {
                    user: { id: "user-1", email: "student1@ucr.edu" },
                    password: "password123"
                }
            ],
            [
                "student2@ucr.edu",
                {
                    user: { id: "user-2", email: "student2@ucr.edu" },
                    password: "hello456"
                }
            ],
            [
                "student3@ucr.edu",
                {
                    user: { id: "user-3", email: "student3@ucr.edu" },
                    password: "test789"
                }
            ]
        ]);
    }

    async login(email: string, password: string): Promise<AuthResult> {
        const normalizedEmail = email.trim().toLowerCase();

        const account = this.credentials.get(normalizedEmail);

        if (!account || account.password !== password) {
            return {
                user: null,
                error: "Incorrect email or password"
            };
        }

        // Create a session for this browser.
        const cookieStore = await cookies();

        cookieStore.set(COOKIE_NAME, account.user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7
        });

        return {
            user: account.user,
            error: null
        };
    }

    async signup(email: string, password: string): Promise<AuthResult> {
        const normalizedEmail = email.trim().toLowerCase();

        if (this.credentials.has(normalizedEmail)) {
            return {
                user: null,
                error: "An account with this email already exists"
            };
        }

        const user: User = {
            id: `user-${this.nextUserId++}`,
            email: normalizedEmail
        };

        this.credentials.set(normalizedEmail, {
            user,
            password
        });

        // Automatically log in the newly created account.
        const cookieStore = await cookies();

        cookieStore.set(COOKIE_NAME, user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7
        });

        return {
            user,
            error: null
        };
    }

    async getCurrentUser(): Promise<User | null> {
        const cookieStore = await cookies();

        const userId = cookieStore.get(COOKIE_NAME)?.value;

        if (!userId) {
            return null;
        }

        // Find the account associated with the cookie.
        for (const account of this.credentials.values()) {
            if (account.user.id === userId) {
                return account.user;
            }
        }

        return null;
    }

    async logout(): Promise<void> {
        const cookieStore = await cookies();

        cookieStore.delete(COOKIE_NAME);
    }
}
import type { IAuthProvider } from "./IAuthProvider";
import type { AuthResult, User } from "../types";

export class FakeAuthProvider implements IAuthProvider {
    // map allows look up by email
    private credentials: Map<string, { user: User; password: string }>;

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
        const account = this.credentials.get(email);

        if (!account || account.password !== password) {
            return {
                user: null,
                error: "Incorrect email or password"
            };
        }

        return {
            user: account.user,
            error: null
        };
    }

    async signup(email: string, password: string): Promise<AuthResult> {
        if (this.credentials.has(email)) {
            return {
                user: null,
                error: "An account with this email already exists"
            };
        }

        const user: User = {
            id: `user-${this.credentials.size + 1}`,
            email
        };

        this.credentials.set(email, {
            user,
            password
        });

        return {
            user,
            error: null
        };
    }
}
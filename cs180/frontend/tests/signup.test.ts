import { FakeAuthProvider } from "@/services/auth/FakeAuthProvider";
import { FakeDatabase } from "@/services/database/FakeDatabase";
import { signupService } from "@/services/auth/authService";

jest.mock("next/headers", () => ({
    cookies: jest.fn()
}));

import { cookies } from "next/headers";

const mockedCookies = jest.mocked(cookies);

function createMockCookieStore() {
    const cookieMap = new Map<string, string>();

    return {
        get: (name: string) => {
            const value = cookieMap.get(name);

            return value === undefined ? undefined : { name, value };
        },
        set: (name: string, value: string) => {
            cookieMap.set(name, value);
        },
        delete: (name: string) => {
            cookieMap.delete(name);
        }
    };
}

describe("Authentication Service - Signup", () => {
    let auth: FakeAuthProvider;
    let db: FakeDatabase;

    beforeEach(() => {
        auth = new FakeAuthProvider();
        db = new FakeDatabase();

        const cookieStore = createMockCookieStore();

        mockedCookies.mockResolvedValue(
            cookieStore as unknown as Awaited<ReturnType<typeof cookies>>
        );
    });

    test("creates a new account and profile", async () => {
        const result = await signupService(
            auth,
            db,
            "newstudent@ucr.edu",
            "newpassword123",
            "New Student"
        );

        expect(result.error).toBeNull();
        expect(result.user).not.toBeNull();

        // Check that the profile was created.
        const profile = await db.getProfile(result.user!.id);

        expect(profile).not.toBeNull();
        expect(profile?.email).toBe("newstudent@ucr.edu");
        expect(profile?.full_name).toBe("New Student");

        // Check that signup automatically logged in the new user.
        const currentUser = await auth.getCurrentUser();

        expect(currentUser?.id).toBe(result.user!.id);
    });

    test("rejects an email that already exists", async () => {
        const result = await signupService(
            auth,
            db,
            "student1@ucr.edu",
            "newpassword123",
            "Another Student"
        );

        expect(result.user).toBeNull();
        expect(result.error).toBe(
            "An account with this email already exists"
        );
    });

    test("rejects a password shorter than 8 characters", async () => {
        const result = await signupService(
            auth,
            db,
            "newstudent@ucr.edu",
            "short",
            "New Student"
        );

        expect(result.user).toBeNull();
        expect(result.error).toBe(
            "Password must be at least 8 characters"
        );
    });
});
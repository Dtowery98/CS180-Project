import { FakeAuthProvider } from "@/services/auth/FakeAuthProvider";
import { loginService } from "@/services/auth/authService";

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

describe("Authentication Service - Login", () => {
    let auth: FakeAuthProvider;

    beforeEach(() => {
        auth = new FakeAuthProvider();

        const cookieStore = createMockCookieStore();

        mockedCookies.mockResolvedValue(
            cookieStore as unknown as Awaited<ReturnType<typeof cookies>>
        );
    });

    test("logs in with correct credentials", async () => {
        const result = await loginService(
            auth,
            "student1@ucr.edu",
            "password123"
        );

        expect(result.error).toBeNull();
        expect(result.user?.id).toBe("user-1");

        // Verify that the login created a session.
        const currentUser = await auth.getCurrentUser();

        expect(currentUser?.id).toBe("user-1");
    });

    test("rejects an incorrect password", async () => {
        const result = await loginService(
            auth,
            "student1@ucr.edu",
            "wrongpassword"
        );

        expect(result.user).toBeNull();
        expect(result.error).toBe("Incorrect email or password");
    });

    test("rejects an unknown email", async () => {
        const result = await loginService(
            auth,
            "unknown@ucr.edu",
            "password123"
        );

        expect(result.user).toBeNull();
        expect(result.error).toBe("Incorrect email or password");
    });

    test("rejects empty input", async () => {
        const result = await loginService(
            auth,
            "",
            "password123"
        );

        expect(result.user).toBeNull();
        expect(result.error).toBe("Please fill all fields");
    });

    test("normalizes email capitalization and whitespace", async () => {
        const result = await loginService(
            auth,
            "  STUDENT1@UCR.EDU  ",
            "password123"
        );

        expect(result.error).toBeNull();
        expect(result.user?.id).toBe("user-1");
    });

    test("logs out the current user", async () => {
        await auth.login("student1@ucr.edu", "password123");

        await auth.logout();

        const currentUser = await auth.getCurrentUser();

        expect(currentUser).toBeNull();
    });
});
import { FakeAuthProvider } from "@/services/auth/FakeAuthProvider";
import { FakeDatabase } from "@/services/database/FakeDatabase";
import { loginService } from "@/services/auth/authService"

describe("Authentication Service", () => {
    let auth: FakeAuthProvider;
    let db: FakeDatabase;

    beforeEach(() => {
        // Start with fresh fake data for every test
        auth = new FakeAuthProvider();
        db = new FakeDatabase();
    });

    describe("Login", () => {
        test("logs in with correct credentials", async () => {
            const result = await loginService(
                auth,
                "student1@ucr.edu",
                "password123"
            );

            expect(result.error).toBeNull();
            expect(result.user?.id).toBe("user-1");
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
    });
});
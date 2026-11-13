import { FakeAuthProvider } from "@/services/auth/FakeAuthProvider";
import { FakeDatabase } from "@/services/database/FakeDatabase";
import { signupService } from "@/services/auth/authService"

describe("Authentication Service", () => {
    let auth: FakeAuthProvider;
    let db: FakeDatabase;

    beforeEach(() => {
        // Start with fresh fake data for every test
        auth = new FakeAuthProvider();
        db = new FakeDatabase();
    });

    describe("Signup", () => {
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

            const profile = await db.getProfile(result.user!.id);

            expect(profile).not.toBeNull();
            expect(profile?.email).toBe("newstudent@ucr.edu");
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
});
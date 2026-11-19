import { FakeDatabase } from "@/services/database/FakeDatabase";

describe("Fake Database", () => {
    let db: FakeDatabase;

    beforeEach(() => {
        db = new FakeDatabase();
    });

    test("retrieves an existing profile", async () => {
        const profile = await db.getProfile("user-1");

        expect(profile).not.toBeNull();
    });

    test("returns null for a nonexistent profile", async () => {
        const profile = await db.getProfile("unknown-user");

        expect(profile).toBeNull();
    });

    test("retrieves all profiles", async () => {
        const profiles = await db.getAllProfiles();

        expect(profiles).toHaveLength(3);
    });

    test("creates a new profile", async () => {
        await db.createProfile({
            id: "user-4",
            email: "student4@ucr.edu",
            full_name: "Sam Student"
        });

        const profile = await db.getProfile("user-4");

        expect(profile?.email).toBe("student4@ucr.edu");
    });

    test("prevents duplicate profile IDs", async () => {
        await expect(
            db.createProfile({
                id: "user-1",
                email: "another@ucr.edu",
                full_name: "Another Student"
            })
        ).rejects.toThrow("Profile already exists");
    });
});
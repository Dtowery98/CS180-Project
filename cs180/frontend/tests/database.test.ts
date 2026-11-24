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

    test("searches for sections by course code", async () => {
        const results = await db.searchSections("CS010");

        expect(results).toHaveLength(2);
        expect(results[0].course_code).toBe("CS010");
        expect(results[0].courses?.title).toBe(
            "Introduction to Computer Science"
        );
    });

    test("includes meeting information in search results", async () => {
        const results = await db.searchSections("CS010");

        expect(results[0].meetings).toHaveLength(1);
        expect(results[0].meetings[0].building).toBe(
            "Winston Chung Hall"
        );
    });

    test("adds a section to a student's schedule", async () => {
        await db.addSection("user-2", "202640", "12345");

        const results = await db.getMySections("user-2");

        expect(results).toHaveLength(2);
    });

    test("does not add duplicate sections", async () => {
        await db.addSection("user-1", "202640", "12345");

        const results = await db.getMySections("user-1");

        expect(results).toHaveLength(2);
    });

    test("removes a section from a student's schedule", async () => {
        await db.removeSection("user-1", "202640", "12345");

        const results = await db.getMySections("user-1");

        expect(results).toHaveLength(1);
        expect(results[0].crn).toBe("23456");
    });

    test("returns an empty array when a course does not exist", async () => {
        const results = await db.searchSections("INVALID");

        expect(results).toHaveLength(0);
    });
    
    test("retrieves clubs", async () => {
        const clubs = await db.getAllClubs();

        expect(clubs.length).toBeGreaterThan(0);
        expect(clubs[0].name).toBe("Computer Science Club");
    });
});
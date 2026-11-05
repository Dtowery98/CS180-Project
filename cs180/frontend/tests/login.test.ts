import { login } from "@/services/authService";

describe("Login", () => {

    test("successfully logs in with correct credentials", async () => {
        const user = await login(
            "student1@ucr.edu",
            "password123"
        );

        expect(user).not.toBeNull();
        expect(user?.id).toBe(1);
        expect(user?.email).toBe("student1@ucr.edu");
    });

    test("rejects an incorrect password", async () => {
        const user = await login(
            "student1@ucr.edu",
            "wrongpassword"
        );

        expect(user).toBeNull();
    });

    test("rejects an email that does not exist", async () => {
        const user = await login(
            "notarealuser@ucr.edu",
            "password123"
        );

        expect(user).toBeNull();
    });

    test("does not return the password when login succeeds", async () => {
        const user = await login(
            "student1@ucr.edu",
            "password123"
        );

        expect(user).not.toHaveProperty("password");
    });

});
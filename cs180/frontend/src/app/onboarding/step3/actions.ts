"use server";

import { createAuthProvider, createDatabase } from "@/services/providers";
import type { ClubOption } from "@/services/types";

// All clubs for the picker
export async function getClubOptions(): Promise<ClubOption[]> {
    try {
        return await createDatabase().getClubOptions();
    } catch (error) {
        console.error("getClubOptions error:", error);
        return [];
    }
}

// The logged-in student's saved clubs
export async function getMyClubIds(): Promise<number[]> {
    const user = await createAuthProvider().getCurrentUser();
    if (!user) return [];
    try {
        return await createDatabase().getMyClubIds(user.id);
    } catch (error) {
        console.error("getMyClubIds error:", error);
        return [];
    }
}

// Save the student's picks (replaces any earlier ones)
export async function saveMyClubs(clubIds: number[]): Promise<{ error?: string }> {
    const user = await createAuthProvider().getCurrentUser();
    if (!user) return { error: "Please log in first." };
    try {
        await createDatabase().setMyClubs(user.id, clubIds);
        return {};
    } catch (error) {
        console.error("saveMyClubs error:", error);
        return { error: "Couldn't save your clubs. Please try again." };
    }
}
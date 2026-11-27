"use server";

import { createAuthProvider, createDatabase } from "@/services/providers";

// saves a cropped photo as the logged-in student's profile picture
export async function uploadAvatar(photo: string): Promise<{ error?: string }> {
    const user = await createAuthProvider().getCurrentUser();
    if (!user) return { error: "Please log in first." };

    // "converts imagie to raw image bytes
    const base64 = photo.split(",")[1];
    if (!base64) return { error: "That photo couldn't be read." };

    try {
        await createDatabase().setAvatar(user.id, Buffer.from(base64, "base64"));
        return {};
    } catch (error) {
        console.error("uploadAvatar error:", error);
        return { error: "Couldn't save your photo. Please try again." };
    }
}
"use server";

import { createAuthProvider, createDatabase } from "@/services/providers";
import type { SectionResult } from "@/services/types";

type ActionResult = {
    error?: string;
};

export async function searchSections(
    query: string
): Promise<SectionResult[]> {
    const db = createDatabase();

    return db.searchSections(query);
}

export async function addSection(
    termCode: string,
    crn: string
): Promise<ActionResult> {

    const auth = createAuthProvider();

    const user = await auth.getCurrentUser();

    if (!user) {
        return { error: "Please log in to add your sections" };
    }

    try {
        const db = createDatabase();

        await db.addSection(user.id, termCode, crn);

        return {};
    } catch (error) {
        console.error("addSection error:", error);

        return { error: "Couldn't add section" };
    }
}

export async function removeSection(
    termCode: string,
    crn: string
): Promise<ActionResult> {

    const auth = createAuthProvider();

    const user = await auth.getCurrentUser();

    if (!user) {
        return { error: "Please log in to remove your sections" };
    }

    try {
        const db = createDatabase();

        await db.removeSection(user.id, termCode, crn);

        return {};
    } catch (error) {
        console.error("removeSection error:", error);

        return { error: "Couldn't remove section" };
    }
}

export async function getMySections(): Promise<SectionResult[]> {
    const auth = createAuthProvider();

    const user = await auth.getCurrentUser();

    if (!user) {
        return [];
    }

    const db = createDatabase();

    return db.getMySections(user.id);
}
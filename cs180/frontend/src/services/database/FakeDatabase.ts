import type { IDatabase } from "./IDatabase";
import type { Profile } from "../types";

export class FakeDatabase implements IDatabase {
    private profiles: Profile[] = [
        {
            id: "user-1",
            email: "student1@ucr.edu",
            full_name: "Alex Smith"
        },
        {
            id: "user-2",
            email: "student2@ucr.edu",
            full_name: "Jordan Lee"
        },
        {
            id: "user-3",
            email: "student3@ucr.edu",
            full_name: "Taylor Brown"
        }
    ];

    async getProfile(userId: string): Promise<Profile | null> {
        return this.profiles.find(
            profile => profile.id === userId
        ) ?? null;
    }

    async getAllProfiles(): Promise<Profile[]> {
        return this.profiles.map(profile => ({ ...profile }));
    }

    async createProfile(profile: Profile): Promise<Profile> {
        const alreadyExists = this.profiles.some(
            existing => existing.id === profile.id
        );

        if (alreadyExists) {
            throw new Error("Profile already exists");
        }

        this.profiles.push({ ...profile });

        return { ...profile };
    }
}
import type { Profile } from "../types";

export interface IDatabase {
    getProfile(userId: string): Promise<Profile | null>;

    getAllProfiles(): Promise<Profile[]>;

    createProfile(profile: Profile): Promise<Profile>;
}
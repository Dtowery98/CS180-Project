import type {
    Profile,
    Course,
    Section,
    Meeting,
    StudentSection,
    Club,
    SectionResult
} from "../types";

export interface IDatabase {
    // Profiles
    getProfile(userId: string): Promise<Profile | null>;
    getAllProfiles(): Promise<Profile[]>;
    createProfile(profile: Profile): Promise<Profile>;

    // Courses and sections
    searchSections(query: string): Promise<SectionResult[]>;

    // Student schedules
    addSection(
        userId: string,
        termCode: string,
        crn: string
    ): Promise<void>;

    removeSection(
        userId: string,
        termCode: string,
        crn: string
    ): Promise<void>;

    getMySections(userId: string): Promise<SectionResult[]>;

    // Clubs
    getAllClubs(): Promise<Club[]>;
}
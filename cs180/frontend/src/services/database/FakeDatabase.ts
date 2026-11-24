import type { IDatabase } from "./IDatabase";

import type {
    Profile,
    Course,
    Section,
    Meeting,
    StudentSection,
    Club,
    SectionResult
} from "../types";

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

    private courses: Course[] = [
        {
            course_code: "CS010",
            subject: "CS",
            course_number: "010",
            title: "Introduction to Computer Science",
            college: "College of Natural and Agricultural Sciences",
            department: "Computer Science",
            units_min: 4,
            units_max: 4,
            description: "Introduction to computer science concepts."
        },
        {
            course_code: "CS111",
            subject: "CS",
            course_number: "111",
            title: "Discrete Structures",
            college: "College of Natural and Agricultural Sciences",
            department: "Computer Science",
            units_min: 4,
            units_max: 4,
            description: "Discrete mathematics for computer science."
        },
        {
            course_code: "CS141",
            subject: "CS",
            course_number: "141",
            title: "Intermediate Data Structures and Algorithms",
            college: "College of Natural and Agricultural Sciences",
            department: "Computer Science",
            units_min: 4,
            units_max: 4,
            description: "Study of data structures and algorithms."
        },
        {
            course_code: "MATH009A",
            subject: "MATH",
            course_number: "009A",
            title: "First-Year Calculus",
            college: "College of Natural and Agricultural Sciences",
            department: "Mathematics",
            units_min: 4,
            units_max: 4,
            description: "Introduction to differential calculus."
        }
    ];

    private sections: Section[] = [
        {
            term_code: "202640",
            crn: "12345",
            course_code: "CS010",
            section: "001",
            class_type: "Lecture",
            instructors: "Professor Smith",
            units_min: 4,
            units_max: 4,
            capacity: 100,
            enrollment: 85,
            seats_available: 15,
            delivery_method: "In Person",
            is_linked: false,
            link_identifier: null
        },
        {
            term_code: "202640",
            crn: "12346",
            course_code: "CS010",
            section: "002",
            class_type: "Discussion",
            instructors: "TA Johnson",
            units_min: 4,
            units_max: 4,
            capacity: 30,
            enrollment: 25,
            seats_available: 5,
            delivery_method: "In Person",
            is_linked: false,
            link_identifier: null
        },
        {
            term_code: "202640",
            crn: "23456",
            course_code: "CS111",
            section: "001",
            class_type: "Lecture",
            instructors: "Professor Williams",
            units_min: 4,
            units_max: 4,
            capacity: 120,
            enrollment: 110,
            seats_available: 10,
            delivery_method: "In Person",
            is_linked: false,
            link_identifier: null
        },
        {
            term_code: "202640",
            crn: "34567",
            course_code: "CS141",
            section: "001",
            class_type: "Lecture",
            instructors: "Professor Brown",
            units_min: 4,
            units_max: 4,
            capacity: 90,
            enrollment: 90,
            seats_available: 0,
            delivery_method: "In Person",
            is_linked: false,
            link_identifier: null
        },
        {
            term_code: "202640",
            crn: "45678",
            course_code: "MATH009A",
            section: "001",
            class_type: "Lecture",
            instructors: "Professor Davis",
            units_min: 4,
            units_max: 4,
            capacity: 150,
            enrollment: 130,
            seats_available: 20,
            delivery_method: "In Person",
            is_linked: false,
            link_identifier: null
        }
    ];

    private meetings: Meeting[] = [
        {
            id: 1,
            term_code: "202640",
            crn: "12345",
            meeting_number: 1,
            meeting_type: "Lecture",
            days: ["Monday", "Wednesday", "Friday"],
            start_time: "09:00:00",
            end_time: "09:50:00",
            start_date: "2026-09-24",
            end_date: "2026-12-11",
            building: "Winston Chung Hall",
            room: "205"
        },
        {
            id: 2,
            term_code: "202640",
            crn: "12346",
            meeting_number: 1,
            meeting_type: "Discussion",
            days: ["Tuesday"],
            start_time: "10:00:00",
            end_time: "10:50:00",
            start_date: "2026-09-24",
            end_date: "2026-12-11",
            building: "Winston Chung Hall",
            room: "100"
        },
        {
            id: 3,
            term_code: "202640",
            crn: "23456",
            meeting_number: 1,
            meeting_type: "Lecture",
            days: ["Monday", "Wednesday"],
            start_time: "12:00:00",
            end_time: "13:20:00",
            start_date: "2026-09-24",
            end_date: "2026-12-11",
            building: "Bourns Hall",
            room: "112"
        },
        {
            id: 4,
            term_code: "202640",
            crn: "34567",
            meeting_number: 1,
            meeting_type: "Lecture",
            days: ["Tuesday", "Thursday"],
            start_time: "14:00:00",
            end_time: "15:20:00",
            start_date: "2026-09-24",
            end_date: "2026-12-11",
            building: "Winston Chung Hall",
            room: "138"
        },
        {
            id: 5,
            term_code: "202640",
            crn: "45678",
            meeting_number: 1,
            meeting_type: "Lecture",
            days: ["Monday", "Wednesday", "Friday"],
            start_time: "11:00:00",
            end_time: "11:50:00",
            start_date: "2026-09-24",
            end_date: "2026-12-11",
            building: "Skye Hall",
            room: "100"
        }
    ];

    private studentSections: StudentSection[] = [
        {
            student_id: "user-1",
            term_code: "202640",
            crn: "12345"
        },
        {
            student_id: "user-1",
            term_code: "202640",
            crn: "23456"
        },
        {
            student_id: "user-2",
            term_code: "202640",
            crn: "34567"
        }
    ];
    
    private clubs: Club[] = [
        {
            id: 1,
            name: "Computer Science Club",
            organization_type: "Academic",
            categories: ["Technology", "Academic"],
            meeting_schedule: "Wednesdays at 6 PM",
            meeting_frequency: "Weekly",
            meeting_notes: "Check the club website for room updates.",
            summary: "A club for students interested in computer science.",
            description: "Work on projects, meet other CS students, and attend technical events.",
            email: "csclub@example.com",
            website: "https://example.com",
            instagram: "@ucrcsclub",
            profile_url: null
        },
        {
            id: 2,
            name: "Game Development Club",
            organization_type: "Academic",
            categories: ["Gaming", "Technology"],
            meeting_schedule: "Thursdays at 5 PM",
            meeting_frequency: "Weekly",
            meeting_notes: null,
            summary: "A community for game developers.",
            description: "Learn game development and collaborate on games.",
            email: "gamedev@example.com",
            website: null,
            instagram: "@ucrgamedev",
            profile_url: null
        }
    ];

    // -------------------------
    // PROFILE METHODS
    // -------------------------

    async getProfile(userId: string): Promise<Profile | null> {
        const profile = this.profiles.find(
            profile => profile.id === userId
        );

        return profile ? { ...profile } : null;
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

    // -------------------------
    // SECTION SEARCH
    // -------------------------

    private buildSectionResult(section: Section): SectionResult {
        const course = this.courses.find(
            course => course.course_code === section.course_code
        );

        const sectionMeetings = this.meetings
            .filter(
                meeting =>
                    meeting.term_code === section.term_code &&
                    meeting.crn === section.crn
            )
            .map(meeting => ({
                days: meeting.days ? [...meeting.days] : null,
                start_time: meeting.start_time,
                end_time: meeting.end_time,
                building: meeting.building,
                room: meeting.room
            }));

        return {
            term_code: section.term_code,
            crn: section.crn,
            course_code: section.course_code,
            section: section.section,
            class_type: section.class_type,
            instructors: section.instructors,
            courses: course ? { title: course.title } : null,
            meetings: sectionMeetings
        };
    }

    async searchSections(query: string): Promise<SectionResult[]> {
        const normalizedQuery = query.trim().toLowerCase();

        return this.sections
            .filter(section =>
                section.course_code.toLowerCase().includes(normalizedQuery)
            )
            .slice(0, 10)
            .map(section => this.buildSectionResult(section));
    }

    // -------------------------
    // STUDENT SCHEDULE METHODS
    // -------------------------

    async addSection(
        userId: string,
        termCode: string,
        crn: string
    ): Promise<void> {

        const sectionExists = this.sections.some(
            section =>
                section.term_code === termCode &&
                section.crn === crn
        );

        if (!sectionExists) {
            throw new Error("Section does not exist");
        }

        const alreadyAdded = this.studentSections.some(
            saved =>
                saved.student_id === userId &&
                saved.term_code === termCode &&
                saved.crn === crn
        );

        // Don't add duplicates.
        if (alreadyAdded) {
            return;
        }

        this.studentSections.push({
            student_id: userId,
            term_code: termCode,
            crn: crn
        });
    }

    async removeSection(
        userId: string,
        termCode: string,
        crn: string
    ): Promise<void> {

        this.studentSections = this.studentSections.filter(
            saved =>
                !(
                    saved.student_id === userId &&
                    saved.term_code === termCode &&
                    saved.crn === crn
                )
        );
    }

    async getMySections(userId: string): Promise<SectionResult[]> {
        const savedSections = this.studentSections.filter(
            saved => saved.student_id === userId
        );

        return savedSections
            .map(saved =>
                this.sections.find(
                    section =>
                        section.term_code === saved.term_code &&
                        section.crn === saved.crn
                )
            )
            .filter((section): section is Section => section !== undefined)
            .map(section => this.buildSectionResult(section));
    }

    // -------------------------
    // CLUB METHODS
    // -------------------------

    async getAllClubs(): Promise<Club[]> {
        return this.clubs.map(club => ({
            ...club,
            categories: club.categories ? [...club.categories] : null
        }));
    }
}
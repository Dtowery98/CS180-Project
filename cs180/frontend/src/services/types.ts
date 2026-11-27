export type User = {
    id: string;
    email: string;
};

export type Profile = {
    id: string;
    email: string;
    full_name: string;
    avatar_url?: string | null;
};

// Just what the club picker needs
export type ClubOption = {
    id: number;
    name: string;
};

export type AuthResult = {
    user: User | null;
    error: string | null;
};

export type AuthState = {
    error?: string;
};

export type Course = {
    course_code: string;
    subject: string;
    course_number: string;
    title: string;
    college: string | null;
    department: string | null;
    units_min: number | null;
    units_max: number | null;
    description: string | null;
};

export type Section = {
    term_code: string;
    crn: string;
    course_code: string;
    section: string;
    class_type: string | null;
    instructors: string | null;
    units_min: number | null;
    units_max: number | null;
    capacity: number | null;
    enrollment: number | null;
    seats_available: number | null;
    delivery_method: string | null;
    is_linked: boolean;
    link_identifier: string | null;
};

export type Meeting = {
    id: number;
    term_code: string;
    crn: string;
    meeting_number: number;
    meeting_type: string | null;
    days: string[] | null;
    start_time: string | null;
    end_time: string | null;
    start_date: string | null;
    end_date: string | null;
    building: string | null;
    room: string | null;
};

export type StudentSection = {
    student_id: string;
    term_code: string;
    crn: string;
};

export type Club = {
    id: number;
    name: string;
    organization_type: string | null;
    categories: string[] | null;
    meeting_schedule: string | null;
    meeting_frequency: string | null;
    meeting_notes: string | null;
    summary: string | null;
    description: string | null;
    email: string | null;
    website: string | null;
    instagram: string | null;
    profile_url: string | null;
};

// This is the joined result returned to your frontend.
// It is not a separate database table.
export type SectionResult = {
    term_code: string;
    crn: string;
    course_code: string;
    section: string;
    class_type: string | null;
    instructors: string | null;
    courses: {
        title: string;
    } | null;
    meetings: {
        days: string[] | null;
        start_time: string | null;
        end_time: string | null;
        building: string | null;
        room: string | null;
    }[];
};
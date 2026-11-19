export type User = {
    id: string;
    email: string;
};

export type Profile = {
    id: string;
    email: string;
    full_name: string;
};

export type AuthResult = {
    user: User | null;
    error: string | null;
};

export type AuthState = {
    error?: string;
};
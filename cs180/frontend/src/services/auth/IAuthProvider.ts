import type { AuthResult, User } from "../types";

export interface IAuthProvider {
    login(email: string, password: string): Promise<AuthResult>;

    signup(email: string, password: string): Promise<AuthResult>;

    getCurrentUser(): Promise<User | null>;

    logout(): Promise<void>;
}
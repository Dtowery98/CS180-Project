import type { AuthResult } from "../types";

export interface IAuthProvider {
    login(email: string, password: string): Promise<AuthResult>;

    signup(email: string, password: string): Promise<AuthResult>;
}
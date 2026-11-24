import type { IAuthProvider } from "./auth/IAuthProvider";
import type { IDatabase } from "./database/IDatabase";

import { FakeAuthProvider } from "./auth/FakeAuthProvider";
import { SupabaseAuthProvider } from "./auth/SupabaseAuthProvider";

import { FakeDatabase } from "./database/FakeDatabase";
import { SupabaseDatabase } from "./database/SupabaseDatabase";

const useFakeBackend = process.env.USE_FAKE_BACKEND === "true";

export function createAuthProvider(): IAuthProvider {
    if (useFakeBackend) return new FakeAuthProvider();
    return new SupabaseAuthProvider();
}

export function createDatabase(): IDatabase {
    if (useFakeBackend) return new FakeDatabase();
    return new SupabaseDatabase();
}
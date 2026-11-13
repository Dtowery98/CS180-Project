import type { IAuthProvider } from "./auth/IAuthProvider";
import type { IDatabase } from "./database/IDatabase";

import { FakeAuthProvider } from "./auth/FakeAuthProvider";
import { SupabaseAuthProvider } from "./auth/SupabaseAuthProvider";

import { FakeDatabase } from "./database/FakeDatabase";
import { SupabaseDatabase } from "./database/SupabaseDatabase";

const useFakeBackend = process.env.USE_FAKE_BACKEND === "true";

// Shared fake instances
const fakeAuth = new FakeAuthProvider();
const fakeDatabase = new FakeDatabase();

export function createAuthProvider(): IAuthProvider {
    return useFakeBackend ? fakeAuth : new SupabaseAuthProvider();
}

export function createDatabase(): IDatabase {
    return useFakeBackend ? fakeDatabase : new SupabaseDatabase();
}
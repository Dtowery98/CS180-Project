import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// supabase  client for code that runs on the server 
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        // Read the login session from the request's cookies
        getAll() {
          return cookieStore.getAll();
        },
        // Save an updated session back to cookies
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            
          }
        },
      },
    }
  );
}
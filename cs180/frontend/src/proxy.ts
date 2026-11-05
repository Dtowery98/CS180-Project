
//initialize supabase client from server cookies
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // start with a "let the request continue" response
  let response = NextResponse.next({ request });

  //creates a supabase client and passes into cookies from the request. If session is expired rebuilds the session and response is wupdated with new cookies.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // 1. Update the request, so pages rendering *this* request see the fresh session
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          // 2. Update the response, so the browser stores the fresh session
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // check supabase session. if it is expired new session is built
  // dont remove this line or users could randomly get logged out
  await supabase.auth.getUser();

  return response;
}

// runs on every page but skip static files like images and Next.js  assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
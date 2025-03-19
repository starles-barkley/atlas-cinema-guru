import NextAuth, { type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  debug: true,
};

// For Next.js App Router usage:
// These let you define [..nextauth]/route.ts with `import { GET, POST } from "@/auth";`
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

/**
 * Custom `auth` wrapper function.
 *  - Checks for a valid session using `getServerSession(authOptions)`
 *  - Attaches `req.auth = { user: { email: ... } }` so your existing code can keep using `req.auth`.
 */
export function auth(routeHandler: Function) {
  return async (req: NextRequest, context: any) => {
    // Check if the user is logged in
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - Not logged in" },
        { status: 401 }
      );
    }

    // Attach a pseudo 'auth' object to the request (like your old code expects)
    (req as any).auth = {
      user: {
        email: session.user?.email || null,
      },
    };

    // Call your actual route handler
    return routeHandler(req, context);
  };
}

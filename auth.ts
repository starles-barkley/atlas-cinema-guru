// auth.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET, // or NEXTAUTH_SECRET
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

/**
 * Optional custom `auth` HOC if you want to keep using `auth(async (req, ctx) => ...)` in routes.
 * If you don't need this, you can remove it.
 */
export function auth(routeHandler: Function) {
  return async (req: NextRequest, context: any) => {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - Not logged in" },
        { status: 401 }
      );
    }

    // Attach a pseudo 'auth' object to the request, if your code expects `req.auth`
    (req as any).auth = {
      user: {
        email: session.user?.email || null,
      },
    };

    return routeHandler(req, context);
  };
}

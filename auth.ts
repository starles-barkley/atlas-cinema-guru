import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const { handlers, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET, // Required!
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  debug: true,
});

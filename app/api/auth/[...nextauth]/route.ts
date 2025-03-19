import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

const authOptions = {
  secret: process.env.AUTH_SECRET, // or process.env.NEXTAUTH_SECRET (ensure consistency)
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

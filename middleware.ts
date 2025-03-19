// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // If user not logged in, redirect to /login
  },
});

export const config = {
  matcher: [
    "/",            // Protect homepage
    "/favorites",   // Protect favorites page
    "/watch-later", // Protect watch-later page
  ],
};

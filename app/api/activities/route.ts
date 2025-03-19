import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"; // Make sure auth.ts exports 'authOptions'
import { fetchActivities } from "@/lib/data";

/**
 * GET /api/activities
 */
export async function GET(req: NextRequest) {
  // Parse the 'page' query parameter
  const url = new URL(req.url);
  const pageParam = url.searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  // Get the session from NextAuth
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized - Not logged in" },
      { status: 401 }
    );
  }

  // Use the user's email from the session
  const email = session.user?.email;
  if (!email) {
    return NextResponse.json(
      { error: "User has no email" },
      { status: 400 }
    );
  }

  // Fetch activities using your existing helper
  const activities = await fetchActivities(page, email);

  return NextResponse.json({ activities });
}

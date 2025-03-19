import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { fetchFavorites } from "@/lib/data"; // The function expects (page, userEmail)

export async function GET(req: NextRequest, context: any) {
  // Parse the URL and get the `page` parameter, defaulting to 1 if missing
  const url = new URL(req.url);
  const pageParam = url.searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  // Ensure we have a valid session
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user?.email;
  if (!email) {
    return NextResponse.json({ error: "No email found" }, { status: 400 });
  }

  try {
    // Pass both `page` and `email` to fetchFavorites
    const favorites = await fetchFavorites(page, email);

    // Return JSON with a `favorites` array
    return NextResponse.json({ favorites });
  } catch (error: any) {
    console.error("Error in GET /api/favorites:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

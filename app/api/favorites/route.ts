import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { fetchFavorites } from "@/lib/data";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // If you want pagination, parse page from query string:
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);

  const email = session.user?.email;
  if (!email) {
    return NextResponse.json({ error: "No email" }, { status: 400 });
  }

  try {
    // fetchFavorites expects (page, userEmail)
    const favorites = await fetchFavorites(page, email);
    return NextResponse.json({ favorites });
  } catch (error: any) {
    console.error("Error in GET /api/favorites:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

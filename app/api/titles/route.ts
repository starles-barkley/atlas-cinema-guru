// app/api/titles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { fetchGenres, fetchTitles } from "@/lib/data";

export async function GET(req: NextRequest) {
  // Retrieve the session from the request using your authOptions.
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized - Not logged in" },
      { status: 401 }
    );
  }

  // Get the user's email from the session.
  const email = session.user?.email;
  if (!email) {
    return NextResponse.json(
      { error: "No email found in session" },
      { status: 401 }
    );
  }

  // Parse query parameters.
  const params = req.nextUrl.searchParams;
  const page = params.get("page") ? Number(params.get("page")) : 1;
  const minYear = params.get("minYear") ? Number(params.get("minYear")) : 0;
  const maxYear = params.get("maxYear")
    ? Number(params.get("maxYear"))
    : new Date().getFullYear();
  const query = params.get("query") ?? "";
  // If no genres provided, use default fetched genres.
  const genres = params.get("genres")?.split(",") ?? (await fetchGenres());

  // Fetch titles from the database.
  const title = await fetchTitles(page, minYear, maxYear, query, genres, email);

  return NextResponse.json({ title });
}

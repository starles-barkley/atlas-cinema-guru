import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { fetchTitles } from "@/lib/data";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const search = url.searchParams.get("search") || "";
  const minYear = parseInt(url.searchParams.get("minYear") || "0", 10);
  const maxYear = parseInt(url.searchParams.get("maxYear") || "9999", 10);

  // Split comma-separated genres
  const genresParam = url.searchParams.get("genres") || "";
  const genres = genresParam
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);

  const email = session.user?.email || "";

  try {
    const titles = await fetchTitles(page, minYear, maxYear, search, genres, email);
    return NextResponse.json(titles);
  } catch (error: any) {
    console.error("Error fetching titles:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

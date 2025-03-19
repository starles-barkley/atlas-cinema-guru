import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { fetchWatchLaters } from "@/lib/data";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);

  const email = session.user?.email;
  if (!email) {
    return NextResponse.json({ error: "No email" }, { status: 400 });
  }

  try {
    // fetchWatchLaters expects (page, userEmail)
    const watchLater = await fetchWatchLaters(page, email);
    return NextResponse.json({ watchLater });
  } catch (error: any) {
    console.error("Error in GET /api/watch-later:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch watch-later" },
      { status: 500 }
    );
  }
}

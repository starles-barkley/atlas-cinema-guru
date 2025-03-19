// app/api/favorites/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { fetchFavorites } from "@/lib/data";

export async function GET() {
  // 1. Check session
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // 2. Extract user email
  const email = session.user?.email;
  if (!email) {
    return NextResponse.json(
      { error: "No user email found" },
      { status: 400 }
    );
  }

  // 3. Fetch favorites from your database or data function
  const favorites = await fetchFavorites(email);

  // 4. Return valid JSON, even if empty
  // e.g., { favorites: [] }
  return NextResponse.json({ favorites });
}

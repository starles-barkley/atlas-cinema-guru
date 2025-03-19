"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import MovieCard from "@/components/MovieCard";

interface Movie {
  id: string;
  title: string;
  poster: string;
  year: number;   // Include any fields your MovieCard or API expects
  genre: string;
}

export default function FavoritesPage() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;

    // Include credentials so cookies are sent, preventing 401 if you're logged in
    fetch("/api/favorites", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            `Error ${res.status}: ${errorData.error || "Failed to fetch"}`
          );
        }
        return res.json();
      })
      .then((data) => {
        // If your /api/favorites returns { favorites: [...] }
        setFavorites(data.favorites);
      })
      .catch((err) => {
        console.error("Error fetching favorites:", err);
        setError(err.message);
      });
  }, [session]);

  if (!session) {
    return <p>Please log in to view your favorites.</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div>
      <h1>Your Favorite Movies</h1>
      <div className="movie-grid">
        {favorites.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

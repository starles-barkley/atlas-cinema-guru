"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import MovieCard from "@/components/MovieCard";

// Make fields optional or consistent with your DB
interface Movie {
  id: string;
  title: string;
  // We can make description optional if your DB doesn't have it
  description?: string;
  poster?: string;
  image?: string;
  year?: number;
  genre?: string;
  favorited?: boolean;
  watchLater?: boolean;
}

export default function FavoritesPage() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;

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
        // If /api/favorites returns { favorites: [...] }
        // unify with your route code
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

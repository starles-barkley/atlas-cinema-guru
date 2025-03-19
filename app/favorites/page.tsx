"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import MovieCard from "@/components/MovieCard";

interface Movie {
  id: string;
  title: string;
  description?: string;
  year?: number;
  genre?: string;
  image?: string;
  favorited?: boolean;
  watchLater?: boolean;
}

export default function FavoritesPage() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Re-fetch favorites on mount, and after toggling
  const fetchFavorites = () => {
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
        setFavorites(data.favorites || []);
      })
      .catch((err) => {
        console.error("Error fetching favorites:", err);
        setError(err.message);
      });
  };

  useEffect(() => {
    if (session) {
      fetchFavorites();
    }
  }, [session]);

  if (!session) {
    return <p>Please log in to view your favorites.</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  // Re-fetch after toggling favorite in MovieCard
  // We'll rely on a custom event or re-render trick
  const handleRefetch = () => {
    fetchFavorites();
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Your Favorite Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onToggleFavorite={handleRefetch}
          />
        ))}
      </div>
    </div>
  );
}

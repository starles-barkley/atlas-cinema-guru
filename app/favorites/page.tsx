"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import MovieCard from "@/components/MovieCard";

interface Movie {
  id: string;
  title: string;
  poster: string;
  // Add other fields if needed, e.g., year, genre, etc.
}

export default function FavoritesPage() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    if (session) {
      fetch("/api/favorites")
        .then((res) => res.json())
        .then((data) => {
          // If your /api/favorites endpoint returns { favorites: [...] },
          // replace setFavorites(data) with setFavorites(data.favorites)
          setFavorites(data);
        })
        .catch((err) => console.error("Error fetching favorites:", err));
    }
  }, [session]);

  if (!session) {
    return <p>Please log in to view your favorites.</p>;
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

"use client";

import { useState } from "react";

interface Movie {
  id: string;
  title: string;
  poster: string;
  year: number;
  genre: string;
  // Include flags if available
  isFavorite?: boolean;
  isWatchLater?: boolean;
}

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isFavorite, setIsFavorite] = useState(movie.isFavorite || false);
  const [isWatchLater, setIsWatchLater] = useState(movie.isWatchLater || false);

  const toggleFavorite = async () => {
    const url = `/api/favorites/${movie.id}`;
    const method = isFavorite ? "DELETE" : "POST";
    const res = await fetch(url, { method });
    if (res.ok) {
      setIsFavorite(!isFavorite);
    }
  };

  const toggleWatchLater = async () => {
    const url = `/api/watch-later/${movie.id}`;
    const method = isWatchLater ? "DELETE" : "POST";
    const res = await fetch(url, { method });
    if (res.ok) {
      setIsWatchLater(!isWatchLater);
    }
  };

  return (
    <div className="border rounded p-2">
      <img src={movie.poster} alt={movie.title} className="w-full h-auto mb-2" />
      <h2 className="font-bold text-lg">{movie.title}</h2>
      <p>{movie.year} • {movie.genre}</p>
      <div className="flex gap-2 mt-2">
        <button onClick={toggleFavorite} className="px-2 py-1 border rounded">
          {isFavorite ? "★" : "☆"}
        </button>
        <button onClick={toggleWatchLater} className="px-2 py-1 border rounded">
          {isWatchLater ? "⏰" : "⌚"}
        </button>
      </div>
    </div>
  );
}

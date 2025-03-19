"use client";

import { useState } from "react";

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

interface MovieCardProps {
  movie: Movie;
  onToggleFavorite?: () => void;     // new optional callback
  onToggleWatchLater?: () => void;  // new optional callback
}

export default function MovieCard({
  movie,
  onToggleFavorite,
  onToggleWatchLater,
}: MovieCardProps) {
  const [isFavorite, setIsFavorite] = useState(!!movie.favorited);
  const [isWatchLater, setIsWatchLater] = useState(!!movie.watchLater);

  const toggleFavorite = async () => {
    const url = `/api/favorites/${movie.id}`;
    const method = isFavorite ? "DELETE" : "POST";
    const res = await fetch(url, { method, credentials: "include" });
    if (res.ok) {
      setIsFavorite(!isFavorite);
      // If a parent page wants to refetch after removing favorites
      if (onToggleFavorite) onToggleFavorite();
    } else {
      console.error("Failed to toggle favorite:", await res.text());
    }
  };

  const toggleWatchLater = async () => {
    const url = `/api/watch-later/${movie.id}`;
    const method = isWatchLater ? "DELETE" : "POST";
    const res = await fetch(url, { method, credentials: "include" });
    if (res.ok) {
      setIsWatchLater(!isWatchLater);
      if (onToggleWatchLater) onToggleWatchLater();
    } else {
      console.error("Failed to toggle watch later:", await res.text());
    }
  };

  const imageSrc = movie.image || `/images/${movie.id}.webp`;

  return (
    <div className="relative group border rounded overflow-hidden">
      {/* Movie Image */}
      <img
        src={imageSrc}
        alt={movie.title}
        className="w-full h-auto"
      />

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end">
        <h2 className="text-lg font-bold">{movie.title}</h2>
        {movie.description && (
          <p className="text-sm">{movie.description}</p>
        )}
        {movie.year !== undefined && movie.genre && (
          <p className="text-sm">
            {movie.year} • {movie.genre}
          </p>
        )}

        {/* Buttons Row */}
        <div className="flex gap-2 mt-3">
          {/* Favorite Button */}
          <button onClick={toggleFavorite}>
            <img
              src={
                isFavorite
                  ? "/assets/star-fill.svg"
                  : "/assets/star-outline.svg"
              }
              alt="Favorite"
              className="w-6 h-6"
            />
          </button>
          {/* Watch Later Button */}
          <button onClick={toggleWatchLater}>
            <img
              src={
                isWatchLater
                  ? "/assets/clock-fill.svg"
                  : "/assets/clock-outline.svg"
              }
              alt="Watch Later"
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

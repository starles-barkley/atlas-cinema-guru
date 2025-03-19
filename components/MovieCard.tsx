"use client";

import { useState } from "react";

interface Movie {
  id: string;
  title: string;
  description: string; // or "plot" if your DB uses that
  year: number;
  genre: string;
  image?: string;        // e.g. /images/xxx.webp
  favorited?: boolean;   // from your DB query
  watchLater?: boolean;  // from your DB query
}

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isFavorite, setIsFavorite] = useState(!!movie.favorited);
  const [isWatchLater, setIsWatchLater] = useState(!!movie.watchLater);

  const toggleFavorite = async () => {
    const url = `/api/favorites/${movie.id}`;
    const method = isFavorite ? "DELETE" : "POST";
    const res = await fetch(url, { method, credentials: "include" });
    if (res.ok) {
      setIsFavorite(!isFavorite);
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
    } else {
      console.error("Failed to toggle watch later:", await res.text());
    }
  };

  return (
    <div className="relative group border rounded overflow-hidden">
      {/* Movie Image */}
      <img
        src={movie.image || `/images/${movie.id}.webp`}
        alt={movie.title}
        className="w-full h-auto"
      />

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end">
        <h2 className="text-lg font-bold">{movie.title}</h2>
        <p className="text-sm">{movie.description}</p>
        <p className="text-sm">
          {movie.year} • {movie.genre}
        </p>

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

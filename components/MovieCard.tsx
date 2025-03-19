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
  onToggleFavorite?: () => void;
  onToggleWatchLater?: () => void;
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

  // Determine the image source
  const imageSrc = movie.image || `/images/${movie.id}.webp`;

  return (
    <div className="relative group border-2 border-teal-500 rounded-lg overflow-hidden bg-[#001a4a] text-white">
      {/* Movie Image */}
      <img
        src={imageSrc}
        alt={movie.title}
        className="w-full h-auto object-cover"
      />

      {/* Top-right icons (no white background) */}
      <div className="absolute top-2 right-2 flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={toggleFavorite} title={isFavorite ? "Unfavorite" : "Favorite"}>
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
        <button
          onClick={toggleWatchLater}
          title={isWatchLater ? "Remove from Watch Later" : "Add to Watch Later"}
        >
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

      {/* Bottom overlay (slides up on hover) */}
      <div className="absolute bottom-0 left-0 w-full bg-[#0b0c3f] p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h2 className="text-lg font-bold">
          {movie.title}
          {movie.year ? ` (${movie.year})` : ""}
        </h2>
        {movie.description && (
          <p className="text-sm mt-1">{movie.description}</p>
        )}
        {movie.genre && (
          <span className="inline-block mt-2 px-2 py-1 bg-teal-500 text-white text-xs rounded">
            {movie.genre}
          </span>
        )}
      </div>
    </div>
  );
}

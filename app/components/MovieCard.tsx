// components/MovieCard.tsx
"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";

interface Movie {
  id: string;
  title: string;
  description: string;
  releaseYear: number;
  genres: string[];
  imageUrl: string;
  isFavorited: boolean;
  isWatchLater: boolean;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { data: session } = useSession();
  const [isFavorited, setIsFavorited] = useState(movie.isFavorited);
  const [isWatchLater, setIsWatchLater] = useState(movie.isWatchLater);

  const toggleFavorite = async () => {
    if (isFavorited) {
      const res = await fetch(`/api/favorites/${movie.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setIsFavorited(false);
      }
    } else {
      const res = await fetch(`/api/favorites/${movie.id}`, {
        method: "POST",
      });
      if (res.ok) {
        setIsFavorited(true);
      }
    }
  };

  const toggleWatchLater = async () => {
    if (isWatchLater) {
      const res = await fetch(`/api/watch-later/${movie.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setIsWatchLater(false);
      }
    } else {
      const res = await fetch(`/api/watch-later/${movie.id}`, {
        method: "POST",
      });
      if (res.ok) {
        setIsWatchLater(true);
      }
    }
  };

  return (
    <div className="relative group border rounded overflow-hidden">
      <img
        src={movie.imageUrl}
        alt={movie.title}
        className="w-full h-64 object-cover"
      />
      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2">
        <div>
          <h2 className="text-white font-bold">{movie.title}</h2>
          <p className="text-white text-sm">{movie.description}</p>
          <p className="text-white text-sm">Year: {movie.releaseYear}</p>
          <p className="text-white text-sm">
            Genres: {movie.genres.join(", ")}
          </p>
        </div>
        <div className="flex justify-end space-x-2">
          <button onClick={toggleFavorite}>
            {isFavorited ? (
              <span className="text-yellow-400 text-2xl">★</span>
            ) : (
              <span className="text-white text-2xl">☆</span>
            )}
          </button>
          <button onClick={toggleWatchLater}>
            {isWatchLater ? (
              <span className="text-green-400 text-2xl">⏰</span>
            ) : (
              <span className="text-white text-2xl">🕒</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

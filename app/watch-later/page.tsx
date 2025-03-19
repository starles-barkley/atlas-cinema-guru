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

export default function WatchLaterPage() {
  const { data: session } = useSession();
  const [list, setList] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchWatchLater = () => {
    fetch("/api/watch-later", { credentials: "include" })
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
        // If /api/watch-later returns { watchLater: [...] }
        setList(data.watchLater || []);
      })
      .catch((err) => {
        console.error("Error fetching watch-later:", err);
        setError(err.message);
      });
  };

  useEffect(() => {
    if (session) {
      fetchWatchLater();
    }
  }, [session]);

  if (!session) {
    return <p>Please log in to view your watch later list.</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  const handleRefetch = () => {
    fetchWatchLater();
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Watch Later</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onToggleWatchLater={handleRefetch}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import MovieCard from "@/components/MovieCard";

/**
 * We'll assume your /api/titles endpoint accepts:
 *  - page
 *  - search (title)
 *  - minYear
 *  - maxYear
 *  - genres (comma-separated)
 */
export default function HomePage() {
  const { data: session } = useSession();
  const [movies, setMovies] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [genres, setGenres] = useState(""); // comma-separated
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch movies whenever filters or page changes
  useEffect(() => {
    if (!session) return; // Relying on middleware to ensure login, but let's be safe

    const fetchMovies = async () => {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        search,
        minYear,
        maxYear,
        genres,
      });
      // Include credentials so session cookies are sent
      const res = await fetch(`/api/titles?${params}`, { credentials: "include" });
      if (!res.ok) {
        console.error("Failed to fetch movies:", await res.text());
        setMovies([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setMovies(data); // Adjust if your endpoint returns { titles: [...] }
      setLoading(false);
    };

    fetchMovies();
  }, [session, page, search, minYear, maxYear, genres]);

  // Reset to page 1 whenever a filter changes
  const handleFilterChange = (setter: Function, value: string) => {
    setter(value);
    setPage(1);
  };

  // UI
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Cinema Guru</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search title..."
          value={search}
          onChange={(e) => handleFilterChange(setSearch, e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Min Year"
          value={minYear}
          onChange={(e) => handleFilterChange(setMinYear, e.target.value)}
          className="border p-2 rounded w-24"
        />
        <input
          type="number"
          placeholder="Max Year"
          value={maxYear}
          onChange={(e) => handleFilterChange(setMaxYear, e.target.value)}
          className="border p-2 rounded w-24"
        />
        <input
          type="text"
          placeholder="Genres (comma-separated)"
          value={genres}
          onChange={(e) => handleFilterChange(setGenres, e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {loading ? (
        <p>Loading movies...</p>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p>No movies found.</p>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}

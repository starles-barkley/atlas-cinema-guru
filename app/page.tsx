"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import MovieCard from "@/components/MovieCard";

export default function HomePage() {
  const { data: session } = useSession();
  const [movies, setMovies] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // (Optional) fetch all genres from /api/genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      const res = await fetch("/api/genres", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setGenres(data.genres || []);
      }
    };
    fetchGenres();
  }, []);

  // Re-fetch movies whenever filters or page changes
  useEffect(() => {
    if (!session) return;

    const fetchMovies = async () => {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        search,
        minYear,
        maxYear,
        genres: selectedGenres.join(","), // comma-separated
      });

      const res = await fetch(`/api/titles?${params}`, {
        credentials: "include",
      });
      if (!res.ok) {
        console.error("Failed to fetch movies:", await res.text());
        setMovies([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setMovies(data); // or data.titles if your endpoint returns { titles: [...] }
      setLoading(false);
    };

    fetchMovies();
  }, [session, page, search, minYear, maxYear, selectedGenres]);

  // Helper: reset to page=1 whenever a filter changes
  const handleFilterChange = (setter: Function, value: string) => {
    setter(value);
    setPage(1);
  };

  const toggleGenre = (g: string) => {
    setPage(1);
    setSelectedGenres((prev) =>
      prev.includes(g) ? prev.filter((item) => item !== g) : [...prev, g]
    );
  };

  if (!session) {
    return <p>Please log in to view the home page.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Cinema Guru</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Title Search */}
        <input
          type="text"
          placeholder="Search title..."
          value={search}
          onChange={(e) => handleFilterChange(setSearch, e.target.value)}
          className="border p-2 rounded"
        />

        {/* Min Year */}
        <input
          type="number"
          placeholder="Min Year"
          value={minYear}
          onChange={(e) => handleFilterChange(setMinYear, e.target.value)}
          className="border p-2 rounded w-24"
        />

        {/* Max Year */}
        <input
          type="number"
          placeholder="Max Year"
          value={maxYear}
          onChange={(e) => handleFilterChange(setMaxYear, e.target.value)}
          className="border p-2 rounded w-24"
        />

        {/* Genre Buttons */}
        <div className="flex items-center gap-2">
          <label className="font-semibold">Genres:</label>
          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => toggleGenre(g)}
                className={`px-2 py-1 border rounded ${
                  selectedGenres.includes(g) ? "bg-blue-500 text-white" : ""
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
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

      {/* Pagination */}
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

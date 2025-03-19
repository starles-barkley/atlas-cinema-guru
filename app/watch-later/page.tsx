"use client";

import { useEffect, useState } from "react";
import MovieCard from "@/components/MovieCard";

export default function HomePage() {
  // State for movies and filters
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [genres, setGenres] = useState("");
  const [page, setPage] = useState(1);

  // Fetch movies when filters or page changes
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      // Build query string based on current filters
      const params = new URLSearchParams();
      params.append("page", page.toString());
      if (search) params.append("search", search);
      if (minYear) params.append("minYear", minYear);
      if (maxYear) params.append("maxYear", maxYear);
      if (genres) params.append("genres", genres);

      const res = await fetch(`/api/titles?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setMovies(data);
      } else {
        console.error("Error fetching movies");
      }
      setLoading(false);
    };

    fetchMovies();
  }, [page, search, minYear, maxYear, genres]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Movie Database</h1>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search movies"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset page on filter change
          }}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Min Year"
          value={minYear}
          onChange={(e) => {
            setMinYear(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Max Year"
          value={maxYear}
          onChange={(e) => {
            setMaxYear(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Genres (comma-separated)"
          value={genres}
          onChange={(e) => {
            setGenres(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded"
        />
      </div>

      {loading ? (
        <p>Loading movies...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {movies.length > 0 ? (
            movies.map((movie: any) => (
              <MovieCard key={movie.id} movie={movie} />
            ))
          ) : (
            <p>No movies found.</p>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}

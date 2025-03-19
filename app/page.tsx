"use client";

import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import MovieCard from "../components/MovieCard";

const HomePage = () => {
  const { data: session, status } = useSession();
  const [movies, setMovies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  // Since our route doesn't return totalPages, default it to 1.
  const [totalPages, setTotalPages] = useState(1);

  // Fetch movies whenever filters or page changes.
  useEffect(() => {
    if (status === "authenticated") {
      fetchMovies();
    }
  }, [searchQuery, minYear, maxYear, selectedGenres, page, status]);

  const fetchMovies = async () => {
    // Change "search" to "query" so the route receives the correct parameter.
    const params = new URLSearchParams({
      page: page.toString(),
      ...(searchQuery && { query: searchQuery }),
      ...(minYear && { minYear }),
      ...(maxYear && { maxYear }),
      ...(selectedGenres.length > 0 && { genres: selectedGenres.join(",") }),
    });

    console.log("Fetching:", `/api/titles?${params.toString()}`);
    try {
      const res = await fetch(`/api/titles?${params.toString()}`);
      if (!res.ok) {
        console.error("Failed to fetch movies");
        return;
      }
      const data = await res.json();
      // The API returns { title: title } where title is the array of movies.
      setMovies(data.title || []);
      // Since totalPages is not provided by the API, we can default to 1.
      setTotalPages(1);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  // Toggle genres in the filter selection.
  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
    setPage(1);
  };

  if (status === "loading") return <p>Loading...</p>;

  if (status === "unauthenticated") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>
          Please{" "}
          <button onClick={() => signIn()} className="underline text-blue-500">
            sign in
          </button>{" "}
          to access the homepage.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Movie Database</h1>

      {/* Filters Section */}
      <div className="mb-4 space-y-4">
        {/* Search Field */}
        <input
          type="text"
          placeholder="Search by title"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          className="border px-2 py-1 w-full"
        />

        {/* Year Filters */}
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Min Year"
            value={minYear}
            onChange={(e) => {
              setMinYear(e.target.value);
              setPage(1);
            }}
            className="border px-2 py-1"
          />
          <input
            type="number"
            placeholder="Max Year"
            value={maxYear}
            onChange={(e) => {
              setMaxYear(e.target.value);
              setPage(1);
            }}
            className="border px-2 py-1"
          />
        </div>

        {/* Genre Filters */}
        <div className="flex space-x-2">
          {["Action", "Comedy", "Drama", "Sci-Fi", "Mystery"].map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreChange(genre)}
              className={`border px-2 py-1 ${
                selectedGenres.includes(genre)
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="border px-4 py-2 disabled:opacity-50"
        >
          Previous
        </button>
        <p>
          Page {page} of {totalPages}
        </p>
        <button
          onClick={() =>
            setPage((prev) => (prev < totalPages ? prev + 1 : prev))
          }
          disabled={page === totalPages}
          className="border px-4 py-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HomePage;

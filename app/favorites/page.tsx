"use client";
import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import MovieCard from "@/components/MovieCard";

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  // If you later add totalPages from your API, you can store it here
  // const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (status === "authenticated") {
      fetchFavorites();
    }
  }, [page, status]);

  const fetchFavorites = async () => {
    try {
      // Matches your route: GET /api/favorites?page={page}
      const res = await fetch(`/api/favorites?page=${page}`);
      if (!res.ok) {
        console.error("Failed to fetch favorites");
        return;
      }
      const data = await res.json();
      // Your route returns { favorites: [...] }, so we use data.favorites
      setFavorites(data.favorites || []);
      // If you return totalPages in your API, you could do:
      // setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  // Show a loading state while NextAuth determines if the user is logged in
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // If user is not logged in, block access
  if (status === "unauthenticated") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>
          Please{" "}
          <button onClick={() => signIn()} className="underline text-blue-500">
            sign in
          </button>{" "}
          to access your favorites.
        </p>
      </div>
    );
  }

  // Render the favorites list
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Favorites</h1>

      {/* Movie Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favorites.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Simple Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="border px-4 py-2 disabled:opacity-50"
        >
          Previous
        </button>
        {/* If you implement totalPages in your API, you can show the current page here */}
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="border px-4 py-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}

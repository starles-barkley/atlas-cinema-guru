"use client"; // Ensures this runs in the browser

import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center p-4 bg-teal-400">
      <h1 className="text-xl font-bold">🎬 Cinema Guru</h1>
      {session ? (
        <div className="flex items-center gap-4">
          <span>Welcome, {session.user?.email}</span>
          <button
            onClick={() => signOut()}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => signIn("github")}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Login with GitHub
        </button>
      )}
    </header>
  );
}

"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-teal-400 z-50 flex items-center px-4 text-black">
      {/* Left side: film icon + brand name */}
      <div className="flex items-center gap-2">
        <img src="/assets/film.svg" alt="Film" className="w-6 h-6" />
        <span className="text-xl font-bold">Cinema Guru</span>
      </div>

      {/* Right side: welcome message + login/logout */}
      <div className="ml-auto flex items-center gap-4">
        {session ? (
          <>
            <span>Welcome, {session.user?.email}</span>
            <button
              onClick={() => signOut()}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn("github")}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}

"use client"; // Ensures it runs in the browser

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Sign in to Cinema Guru</h1>
      <button
        onClick={() => signIn("github")}
        className="px-6 py-2 bg-blue-500 text-white rounded"
      >
        Sign in with GitHub
      </button>
    </div>
  );
}

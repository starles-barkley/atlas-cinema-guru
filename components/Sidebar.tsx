"use client";

import Link from "next/link";
import ActivityFeed from "./ActivityFeed";

export default function Sidebar() {
  return (
    <aside className="w-64 p-4 bg-gray-900 text-white">
      <nav className="mb-4">
        <ul>
          <li>
          <Link href="/" className="block py-2">
            Home
          </Link>
          </li>
          <li>
            <Link href="/favorites" className="block py-2">
              Favorites
            </Link>
          </li>
          <li>
            <Link href="/watch-later" className="block py-2">
              Watch Later
            </Link>
          </li>
        </ul>
      </nav>
      <ActivityFeed />
    </aside>
  );
}

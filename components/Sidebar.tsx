"use client";

import Link from "next/link";
import { useState } from "react";
import ActivityFeed from "./ActivityFeed";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className={`
        fixed top-16 left-0 h-[calc(100%-4rem)]
        bg-teal-400 transition-all duration-300
        z-40
        ${expanded ? "w-64" : "w-16"}
      `}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <nav className="flex flex-col h-full">
        {/* Icons / Links */}
        <div className="p-4 flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/assets/home.svg"
              alt="Home"
              className="w-6 h-6"
            />
            {expanded && <span>Home</span>}
          </Link>

          <Link href="/favorites" className="flex items-center gap-2">
            <img
              src="/assets/star-fill.svg"
              alt="Favorites"
              className="w-6 h-6"
            />
            {expanded && <span>Favorites</span>}
          </Link>

          <Link href="/watch-later" className="flex items-center gap-2">
            <img
              src="/assets/clock-fill.svg"
              alt="Watch Later"
              className="w-6 h-6"
            />
            {expanded && <span>Watch Later</span>}
          </Link>
        </div>

        {/* Activity feed only when expanded */}
        {expanded && (
          <div className="flex-1 overflow-y-auto p-4 bg-teal-300 text-black">
            <ActivityFeed />
          </div>
        )}
      </nav>
    </aside>
  );
}

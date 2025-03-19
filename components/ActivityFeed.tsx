"use client";

import { useEffect, useState } from "react";

interface Activity {
  id: number;
  timestamp: string;
  activity: string; // e.g. "FAVORITED" or "WATCH_LATER"
  title: string;    // movie title
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Simple polling approach: fetch activities every 5 seconds
  const fetchActivities = async () => {
    try {
      const res = await fetch("/api/activities", { credentials: "include" });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch activities");
      }
      const data = await res.json();
      // If your endpoint returns { activities: [...] }
      setActivities(data.activities || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(() => {
      fetchActivities();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <p className="text-red-600">Error: {error}</p>;
  }

  return (
    <div>
      <h2 className="font-bold mb-2">Latest Activities</h2>
      {activities.length > 0 ? (
        <ul className="space-y-2 text-sm">
          {activities.map((act) => (
            <li key={act.id}>
              <p>
                {new Date(act.timestamp).toLocaleString()}
              </p>
              <p>
                {act.activity === "FAVORITED"
                  ? "Favorited"
                  : "Added"}{" "}
                <strong>{act.title}</strong>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm">No recent activity.</p>
      )}
    </div>
  );
}

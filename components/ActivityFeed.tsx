"use client";

import { useEffect, useState } from "react";

interface Activity {
  id: string;
  date: string;
  action: string;
  title: string;
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      const res = await fetch("/api/activities");
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      } else {
        console.error("Failed to fetch activity");
      }
      setLoading(false);
    };

    fetchActivities();
  }, []);

  if (loading) return <p>Loading activity...</p>;

  return (
    <div className="p-4 bg-gray-800 text-white rounded">
      <h2 className="text-xl font-bold mb-2">Recent Activity</h2>
      {activities.length > 0 ? (
        activities.map((activity) => (
          <div key={activity.id} className="mb-2 text-sm">
            <p>
              <span className="font-bold">{new Date(activity.date).toLocaleString()}</span> – {activity.title} {activity.action}
            </p>
          </div>
        ))
      ) : (
        <p>No recent activity.</p>
      )}
    </div>
  );
}

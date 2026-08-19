import { useEffect, useState } from "react";
import { formatInTimeZone, getDateInTimeZone } from "../utils/dateHelpers";

const CITIES = [
  { name: "New York", tz: "America/New_York" },
  { name: "London", tz: "Europe/London" },
  { name: "Tokyo", tz: "Asia/Tokyo" },
  { name: "Sydney", tz: "Australia/Sydney" },
  { name: "Dubai", tz: "Asia/Dubai" },
  { name: "Paris", tz: "Europe/Paris" },
];

export default function WorldClocks() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="tad-card p-5">
      <h2 className="text-lg font-semibold text-[#003366] dark:text-blue-300 mb-4 pb-2 border-b" style={{ borderColor: "var(--tad-border)" }}>
        World Clock
      </h2>
      <p className="text-sm text-gray-500 mb-4">Current local time around the world.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CITIES.map((city) => (
          <div key={city.tz} className="border rounded p-3 bg-gray-50 dark:bg-gray-800/50" style={{ borderColor: "var(--tad-border)" }}>
            <div className="font-medium text-[#0066cc]">{city.name}</div>
            <div className="text-xl font-mono font-semibold tabular-nums mt-0.5">
              {formatInTimeZone(now, city.tz)}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {getDateInTimeZone(now, city.tz)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

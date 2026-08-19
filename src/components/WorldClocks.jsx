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
    <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-xl font-semibold mb-4">World Clocks</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CITIES.map((city) => (
          <div
            key={city.tz}
            className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700"
          >
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {city.name}
            </div>
            <div className="text-2xl font-mono font-semibold mt-1 tabular-nums">
              {formatInTimeZone(now, city.tz)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {getDateInTimeZone(now, city.tz)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

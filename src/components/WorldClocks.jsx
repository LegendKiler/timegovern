import { useEffect, useState } from "react";
import { formatInTimeZone, getDateInTimeZone } from "../utils/dateHelpers";

const CITIES = [
  { name: "New York", tz: "America/New_York", flag: "🇺🇸" },
  { name: "London", tz: "Europe/London", flag: "🇬🇧" },
  { name: "Tokyo", tz: "Asia/Tokyo", flag: "🇯🇵" },
  { name: "Sydney", tz: "Australia/Sydney", flag: "🇦🇺" },
  { name: "Dubai", tz: "Asia/Dubai", flag: "🇦🇪" },
  { name: "Paris", tz: "Europe/Paris", flag: "🇫🇷" },
];

export default function WorldClocks() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="premium-card p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title">World Clocks</h2>
        <span className="text-xs muted">6 major cities</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CITIES.map((city) => (
          <div
            key={city.tz}
            className="premium-card-inner p-4 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{city.flag}</span>
              <span className="font-semibold text-gray-900 dark:text-gray-50">
                {city.name}
              </span>
            </div>
            <div className="text-2xl font-mono font-bold tabular-nums tracking-tight text-gray-900 dark:text-white">
              {formatInTimeZone(now, city.tz)}
            </div>
            <div className="text-xs muted mt-1.5">
              {getDateInTimeZone(now, city.tz)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

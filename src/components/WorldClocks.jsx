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
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="flex flex-col space-y-1.5 p-6 pb-4">
        <h3 className="font-semibold leading-none tracking-tight">World Clocks</h3>
        <p className="text-sm text-muted-foreground">Major cities around the world</p>
      </div>

      <div className="p-6 pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CITIES.map((city) => (
            <div
              key={city.tz}
              className="rounded-lg border bg-background p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="font-medium text-sm">{city.name}</div>
              <div className="text-2xl font-mono font-semibold tabular-nums mt-1 tracking-tight">
                {formatInTimeZone(now, city.tz)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {getDateInTimeZone(now, city.tz)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

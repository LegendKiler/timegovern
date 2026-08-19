import { useEffect, useState, useMemo } from "react";
import { getWeekNumber, getUtcOffset } from "../utils/dateHelpers";

export default function Clocks() {
  const [now, setNow] = useState(new Date());
  const [selectedTz, setSelectedTz] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeZones = useMemo(() => {
    try {
      return Intl.supportedValuesOf("timeZone").sort();
    } catch {
      return [
        "UTC",
        "America/New_York",
        "Europe/London",
        "Asia/Tokyo",
        "Australia/Sydney",
        "Asia/Dubai",
        "Europe/Paris",
      ];
    }
  }, []);

  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours() % 12;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;

  const tzTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: selectedTz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);

  const tzDate = new Intl.DateTimeFormat("en-GB", {
    timeZone: selectedTz,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(now);

  return (
    <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-xl font-semibold mb-4">Clocks & Time</h2>

      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <div className="relative w-48 h-48 shrink-0">
          <div className="absolute inset-0 rounded-full border-4 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 shadow-inner">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-3 bg-gray-500 dark:bg-gray-400 left-1/2 top-2 -translate-x-1/2 origin-bottom"
                style={{ transform: `rotate(${i * 30}deg) translateY(4px)` }}
              />
            ))}

            <div
              className="absolute left-1/2 top-1/2 w-1.5 h-14 -ml-0.75 -mt-14 bg-gray-800 dark:bg-gray-200 rounded-full clock-hand"
              style={{ transform: `rotate(${hourDeg}deg)` }}
            />
            <div
              className="absolute left-1/2 top-1/2 w-1 h-20 -ml-0.5 -mt-20 bg-blue-600 dark:bg-blue-400 rounded-full clock-hand"
              style={{ transform: `rotate(${minuteDeg}deg)` }}
            />
            <div
              className="absolute left-1/2 top-1/2 w-0.5 h-22 -ml-px -mt-22 bg-red-500 rounded-full clock-hand"
              style={{ transform: `rotate(${secondDeg}deg)` }}
            />
            <div className="absolute left-1/2 top-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-red-500" />
          </div>
        </div>

        <div className="flex-1 w-full space-y-4">
          <div className="text-4xl md:text-5xl font-mono font-bold tracking-wider tabular-nums">
            {tzTime}
          </div>

          <div className="text-lg text-gray-600 dark:text-gray-300">
            {tzDate}
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span>Week {getWeekNumber(now)}</span>
            <span>•</span>
            <span>{getUtcOffset(now)}</span>
          </div>

          <div>
            <label
              htmlFor="tz-select"
              className="block text-sm font-medium mb-1"
            >
              Timezone
            </label>
            <select
              id="tz-select"
              value={selectedTz}
              onChange={(e) => setSelectedTz(e.target.value)}
              className="w-full max-w-md px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Select timezone"
            >
              {timeZones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}

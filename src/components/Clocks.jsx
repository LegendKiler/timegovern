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
    <section className="premium-card p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title">Clocks & Time</h2>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
          Live
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-center">
        {/* Analog Clock – Premium */}
        <div className="relative w-52 h-52 shrink-0">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-inner border border-gray-200 dark:border-gray-700">
            {/* Hour marks */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-3.5 bg-gray-400 dark:bg-gray-500 left-1/2 top-3 -translate-x-1/2 origin-bottom rounded-full"
                style={{ transform: `rotate(${i * 30}deg) translateY(2px)` }}
              />
            ))}

            {/* Hour hand */}
            <div
              className="absolute left-1/2 top-1/2 w-1.5 h-16 -ml-[3px] -mt-16 bg-gray-800 dark:bg-gray-100 rounded-full clock-hand shadow-sm"
              style={{ transform: `rotate(${hourDeg}deg)` }}
            />
            {/* Minute hand */}
            <div
              className="absolute left-1/2 top-1/2 w-1 h-22 -ml-0.5 -mt-22 bg-blue-600 dark:bg-blue-400 rounded-full clock-hand shadow-sm"
              style={{ transform: `rotate(${minuteDeg}deg)` }}
            />
            {/* Second hand */}
            <div
              className="absolute left-1/2 top-1/2 w-0.5 h-24 -ml-px -mt-24 bg-red-500 rounded-full clock-hand"
              style={{ transform: `rotate(${secondDeg}deg)` }}
            />
            {/* Center */}
            <div className="absolute left-1/2 top-1/2 w-3.5 h-3.5 -ml-[7px] -mt-[7px] rounded-full bg-red-500 ring-4 ring-white dark:ring-gray-900 shadow" />
          </div>
        </div>

        {/* Digital + Controls */}
        <div className="flex-1 w-full space-y-5">
          <div className="text-5xl sm:text-6xl font-mono font-bold tracking-tight tabular-nums text-gray-900 dark:text-white">
            {tzTime}
          </div>

          <div className="text-lg text-gray-600 dark:text-gray-300 font-medium">
            {tzDate}
          </div>

          <div className="flex flex-wrap gap-3 text-sm muted">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">
              Week {getWeekNumber(now)}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">
              {getUtcOffset(now)}
            </span>
          </div>

          <div className="pt-1">
            <label
              htmlFor="tz-select"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Timezone
            </label>
            <select
              id="tz-select"
              value={selectedTz}
              onChange={(e) => setSelectedTz(e.target.value)}
              className="w-full max-w-md px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
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

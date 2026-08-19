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
      return ["UTC", "America/New_York", "Europe/London", "Asia/Tokyo", "Australia/Sydney", "Asia/Dubai", "Europe/Paris"];
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
    <div className="tad-card p-5">
      <h2 className="text-lg font-semibold text-[#003366] dark:text-blue-300 mb-4 pb-2 border-b" style={{ borderColor: "var(--tad-border)" }}>
        Clocks & Time
      </h2>

      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <div className="relative w-44 h-44 shrink-0">
          <div className="absolute inset-0 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-2.5 bg-gray-500 left-1/2 top-2 -translate-x-1/2 origin-bottom"
                style={{ transform: `rotate(${i * 30}deg) translateY(2px)` }}
              />
            ))}
            <div className="absolute left-1/2 top-1/2 w-1.5 h-12 -ml-[3px] -mt-12 bg-gray-800 dark:bg-gray-200 rounded-full clock-hand" style={{ transform: `rotate(${hourDeg}deg)` }} />
            <div className="absolute left-1/2 top-1/2 w-1 h-16 -ml-0.5 -mt-16 bg-[#0066cc] rounded-full clock-hand" style={{ transform: `rotate(${minuteDeg}deg)` }} />
            <div className="absolute left-1/2 top-1/2 w-0.5 h-20 -ml-px -mt-20 bg-red-500 rounded-full clock-hand" style={{ transform: `rotate(${secondDeg}deg)` }} />
            <div className="absolute left-1/2 top-1/2 w-2.5 h-2.5 -ml-[5px] -mt-[5px] rounded-full bg-red-500" />
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="text-4xl font-mono font-semibold tabular-nums text-[#003366] dark:text-blue-200">
            {tzTime}
          </div>
          <div className="text-base text-gray-600 dark:text-gray-300">{tzDate}</div>
          <div className="flex gap-3 text-sm text-gray-500">
            <span>Week {getWeekNumber(now)}</span>
            <span>•</span>
            <span>{getUtcOffset(now)}</span>
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium mb-1">Timezone</label>
            <select
              value={selectedTz}
              onChange={(e) => setSelectedTz(e.target.value)}
              className="w-full max-w-md border rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            >
              {timeZones.map((tz) => (
                <option key={tz} value={tz}>{tz.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import {
  eachDayOfInterval,
  isWeekend,
  addDays,
  format,
  parseISO,
} from "date-fns";

const HOLIDAYS_2026 = {
  US: [
    "2026-01-01", "2026-01-19", "2026-02-16", "2026-05-25", "2026-06-19",
    "2026-07-04", "2026-09-07", "2026-11-11", "2026-11-26", "2026-12-25",
  ],
  UK: [
    "2026-01-01", "2026-04-03", "2026-04-06", "2026-05-04", "2026-05-25",
    "2026-08-31", "2026-12-25", "2026-12-28",
  ],
  AU: [
    "2026-01-01", "2026-01-26", "2026-04-03", "2026-04-06", "2026-04-25",
    "2026-06-08", "2026-12-25", "2026-12-28",
  ],
  NZ: [
    "2026-01-01", "2026-01-02", "2026-02-06", "2026-04-03", "2026-04-06",
    "2026-04-25", "2026-06-01", "2026-10-26", "2026-12-25", "2026-12-28",
  ],
};

function isHoliday(date, region) {
  const iso = format(date, "yyyy-MM-dd");
  return (HOLIDAYS_2026[region] || []).includes(iso);
}

function countWorkingDays(start, end, region) {
  if (!start || !end || start > end) return 0;
  const days = eachDayOfInterval({ start, end });
  return days.filter((d) => !isWeekend(d) && !isHoliday(d, region)).length;
}

function projectDeadline(start, workingDays, region) {
  if (!start || workingDays <= 0) return null;
  let current = start;
  let remaining = workingDays;

  while (remaining > 0) {
    if (!isWeekend(current) && !isHoliday(current, region)) {
      remaining -= 1;
      if (remaining === 0) break;
    }
    current = addDays(current, 1);
  }
  return current;
}

export default function BusinessCalculators() {
  const [region, setRegion] = useState("US");
  const [start1, setStart1] = useState("");
  const [end1, setEnd1] = useState("");
  const [start2, setStart2] = useState("");
  const [days2, setDays2] = useState(10);

  const workingCount =
    start1 && end1
      ? countWorkingDays(parseISO(start1), parseISO(end1), region)
      : null;

  const projected =
    start2 && days2 > 0
      ? projectDeadline(parseISO(start2), Number(days2), region)
      : null;

  return (
    <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-xl font-semibold mb-4">
        Business & Project Planning
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Region</label>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          aria-label="Select holiday region"
        >
          <option value="US">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="AU">Australia</option>
          <option value="NZ">New Zealand</option>
        </select>
      </div>

      <div className="mb-8 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700">
        <h3 className="font-medium mb-3">Working-Day Counter</h3>
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <div>
            <label className="block text-xs mb-1">Start date</label>
            <input
              type="date"
              value={start1}
              onChange={(e) => setStart1(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Working day counter start date"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">End date</label>
            <input
              type="date"
              value={end1}
              onChange={(e) => setEnd1(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Working day counter end date"
            />
          </div>
        </div>
        {workingCount !== null && (
          <p className="text-lg">
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {workingCount}
            </span>{" "}
            working days (Mon–Fri, excluding {region} holidays)
          </p>
        )}
      </div>

      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700">
        <h3 className="font-medium mb-3">Deadline Projector</h3>
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <div>
            <label className="block text-xs mb-1">Start date</label>
            <input
              type="date"
              value={start2}
              onChange={(e) => setStart2(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Deadline projector start date"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Working days needed</label>
            <input
              type="number"
              min="1"
              value={days2}
              onChange={(e) => setDays2(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none w-28"
              aria-label="Number of working days"
            />
          </div>
        </div>
        {projected && (
          <p className="text-lg">
            Projected end date:{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {format(projected, "EEEE, d MMMM yyyy")}
            </span>
          </p>
        )}
      </div>
    </section>
  );
}

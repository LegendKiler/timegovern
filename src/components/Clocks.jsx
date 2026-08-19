import { useEffect, useState, useMemo } from "react";
import { getWeekNumber, getUtcOffset } from "../utils/dateHelpers";
import { cn } from "../lib/utils";

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
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="flex flex-col space-y-1.5 p-6 pb-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold leading-none tracking-tight">Clocks & Time</h3>
          <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors bg-secondary text-secondary-foreground">
            Live
          </span>
        </div>
      </div>

      <div className="p-6 pt-0">
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          {/* Analog */}
          <div className="relative w-48 h-48 shrink-0">
            <div className="absolute inset-0 rounded-full border-2 border-border bg-muted/30">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-3 bg-muted-foreground/60 left-1/2 top-2 -translate-x-1/2 origin-bottom"
                  style={{ transform: `rotate(${i * 30}deg) translateY(2px)` }}
                />
              ))}
              <div
                className="absolute left-1/2 top-1/2 w-1.5 h-14 -ml-[3px] -mt-14 bg-foreground rounded-full clock-hand"
                style={{ transform: `rotate(${hourDeg}deg)` }}
              />
              <div
                className="absolute left-1/2 top-1/2 w-1 h-20 -ml-0.5 -mt-20 bg-primary rounded-full clock-hand"
                style={{ transform: `rotate(${minuteDeg}deg)` }}
              />
              <div
                className="absolute left-1/2 top-1/2 w-0.5 h-22 -ml-px -mt-22 bg-destructive rounded-full clock-hand"
                style={{ transform: `rotate(${secondDeg}deg)` }}
              />
              <div className="absolute left-1/2 top-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-destructive ring-2 ring-background" />
            </div>
          </div>

          <div className="flex-1 w-full space-y-4">
            <div className="text-5xl font-mono font-bold tracking-tighter tabular-nums">
              {tzTime}
            </div>
            <div className="text-muted-foreground">{tzDate}</div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                Week {getWeekNumber(now)}
              </span>
              <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                {getUtcOffset(now)}
              </span>
            </div>

            <div className="pt-2">
              <label htmlFor="tz-select" className="text-sm font-medium leading-none mb-2 block">
                Timezone
              </label>
              <select
                id="tz-select"
                value={selectedTz}
                onChange={(e) => setSelectedTz(e.target.value)}
                className={cn(
                  "flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm",
                  "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
              >
                {timeZones.map((tz) => (
                  <option key={tz} value={tz}>{tz.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

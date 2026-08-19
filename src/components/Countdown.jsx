import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";
import { cn } from "../lib/utils";

export default function Countdown() {
  const [target, setTarget] = useState("");
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    if (!target) {
      setRemaining(null);
      return;
    }
    const update = () => {
      const diff = differenceInSeconds(new Date(target), new Date());
      if (diff <= 0) {
        setRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, finished: true });
        return;
      }
      setRemaining({
        days: Math.floor(diff / 86400),
        hours: Math.floor((diff % 86400) / 3600),
        minutes: Math.floor((diff % 3600) / 60),
        seconds: diff % 60,
        finished: false,
      });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow h-full">
      <div className="flex flex-col space-y-1.5 p-6 pb-4">
        <h3 className="font-semibold leading-none tracking-tight">Countdown</h3>
      </div>

      <div className="p-6 pt-0 space-y-4">
        <div>
          <label htmlFor="countdown-target" className="text-sm font-medium leading-none mb-2 block">
            Target date & time
          </label>
          <input
            id="countdown-target"
            type="datetime-local"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
              "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          />
        </div>

        {remaining && (
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Days", value: remaining.days },
              { label: "Hours", value: remaining.hours },
              { label: "Mins", value: remaining.minutes },
              { label: "Secs", value: remaining.seconds },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border bg-background p-3 text-center">
                <div className="text-2xl font-bold tabular-nums">
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {remaining?.finished && (
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Countdown finished!
          </p>
        )}
      </div>
    </div>
  );
}

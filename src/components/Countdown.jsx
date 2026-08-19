import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";

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
      const days = Math.floor(diff / 86400);
      const hours = Math.floor((diff % 86400) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;
      setRemaining({ days, hours, minutes, seconds, finished: false });
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <section className="premium-card p-6 h-full">
      <h2 className="section-title text-base mb-5">Countdown Timer</h2>

      <div className="space-y-5">
        <div>
          <label htmlFor="countdown-target" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Target date & time
          </label>
          <input
            id="countdown-target"
            type="datetime-local"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            aria-label="Select target date and time for countdown"
          />
        </div>

        {remaining && (
          <div className="grid grid-cols-4 gap-2.5">
            {[
              { label: "Days", value: remaining.days },
              { label: "Hours", value: remaining.hours },
              { label: "Mins", value: remaining.minutes },
              { label: "Secs", value: remaining.seconds },
            ].map((item) => (
              <div
                key={item.label}
                className="premium-card-inner p-3 text-center"
              >
                <div className="text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="text-[11px] uppercase tracking-wider text-gray-400 mt-1">
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
    </section>
  );
}

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
    <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-xl font-semibold mb-4">Countdown Timer</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="countdown-target" className="block text-sm font-medium mb-1">
            Target date & time
          </label>
          <input
            id="countdown-target"
            type="datetime-local"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full max-w-xs px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="Select target date and time for countdown"
          />
        </div>

        {remaining && (
          <div className="grid grid-cols-4 gap-3 text-center">
            {[
              { label: "Days", value: remaining.days },
              { label: "Hours", value: remaining.hours },
              { label: "Mins", value: remaining.minutes },
              { label: "Secs", value: remaining.seconds },
            ].map((item) => (
              <div
                key={item.label}
                className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700"
              >
                <div className="text-2xl md:text-3xl font-bold tabular-nums">
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {remaining?.finished && (
          <p className="text-green-600 dark:text-green-400 font-medium">
            Countdown finished!
          </p>
        )}
      </div>
    </section>
  );
}

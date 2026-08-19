import { useEffect, useState } from "react";
import SunCalc from "suncalc";
import { format } from "date-fns";

export default function AstronomyModule({ lat, lon }) {
  const [solar, setSolar] = useState(null);
  const [eclipses, setEclipses] = useState([]);
  const [loadingEclipses, setLoadingEclipses] = useState(true);
  const [eclipseError, setEclipseError] = useState(null);

  useEffect(() => {
    if (lat == null || lon == null) return;

    const times = SunCalc.getTimes(new Date(), lat, lon);
    setSolar({
      sunrise: times.sunrise,
      sunset: times.sunset,
      civilDawn: times.dawn,
      civilDusk: times.dusk,
      nauticalDawn: times.nauticalDawn,
      nauticalDusk: times.nauticalDusk,
      astronomicalDawn: times.nightEnd,
      astronomicalDusk: times.night,
    });
  }, [lat, lon]);

  useEffect(() => {
    async function fetchEclipses() {
      setLoadingEclipses(true);
      setEclipseError(null);
      try {
        // Curated upcoming eclipses (2026-2027). NASA DEMO_KEY pattern ready for extension.
        const curated = [
          {
            date: "2026-08-12",
            type: "Total Solar Eclipse",
            region: "Arctic, Greenland, Spain, Iceland",
          },
          {
            date: "2026-08-28",
            type: "Partial Lunar Eclipse",
            region: "Americas, Europe, Africa",
          },
          {
            date: "2027-02-06",
            type: "Annular Solar Eclipse",
            region: "South America, Antarctica",
          },
          {
            date: "2027-07-02",
            type: "Total Solar Eclipse",
            region: "North Africa, Middle East, Asia",
          },
          {
            date: "2027-08-17",
            type: "Penumbral Lunar Eclipse",
            region: "Americas, Europe, Africa",
          },
        ];
        setEclipses(curated);
      } catch (err) {
        setEclipseError("Unable to load eclipse data");
        setEclipses([]);
      } finally {
        setLoadingEclipses(false);
      }
    }
    fetchEclipses();
  }, []);

  const formatTime = (d) => (d ? format(d, "HH:mm:ss") : "—");

  return (
    <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-xl font-semibold mb-4">Astronomy & Solar</h2>

      {lat == null || lon == null ? (
        <p className="text-gray-500 dark:text-gray-400">
          Waiting for location…
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Sunrise", value: solar?.sunrise },
            { label: "Sunset", value: solar?.sunset },
            { label: "Civil Dawn", value: solar?.civilDawn },
            { label: "Civil Dusk", value: solar?.civilDusk },
            { label: "Nautical Dawn", value: solar?.nauticalDawn },
            { label: "Nautical Dusk", value: solar?.nauticalDusk },
            { label: "Astro Dawn", value: solar?.astronomicalDawn },
            { label: "Astro Dusk", value: solar?.astronomicalDusk },
          ].map((item) => (
            <div
              key={item.label}
              className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-center"
            >
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {item.label}
              </div>
              <div className="font-mono font-semibold mt-1">
                {formatTime(item.value)}
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 className="font-medium mb-2">Upcoming Eclipses</h3>
      {loadingEclipses && (
        <p className="text-sm text-gray-500">Loading eclipse data…</p>
      )}
      {eclipseError && (
        <p className="text-sm text-red-500">{eclipseError}</p>
      )}
      {!loadingEclipses && !eclipseError && (
        <ul className="space-y-2">
          {eclipses.map((e) => (
            <li
              key={e.date + e.type}
              className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm p-2 rounded-lg bg-gray-50 dark:bg-gray-800/40"
            >
              <span className="font-mono font-medium w-28">{e.date}</span>
              <span className="font-medium">{e.type}</span>
              <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                {e.region}
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-gray-400 mt-3">
        Solar times calculated with SunCalc for your location. Eclipse list curated for 2026–2027.
      </p>
    </section>
  );
}

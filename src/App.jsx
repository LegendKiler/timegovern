import { useState, useCallback, useEffect } from "react";
import ThemeToggle from "./components/ThemeToggle";
import Clocks from "./components/Clocks";
import WorldClocks from "./components/WorldClocks";
import Calendar from "./components/Calendar";
import Countdown from "./components/Countdown";
import AstronomyModule from "./components/AstronomyModule";
import BusinessCalculators from "./components/BusinessCalculators";
import GeoNewsWeather from "./components/GeoNewsWeather";

export default function App() {
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleLocation = useCallback((latitude, longitude) => {
    setLat(latitude);
    setLon(longitude);
  }, []);

  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--tad-bg)" }}>
      {/* ===== timeanddate-style top bar ===== */}
      <div className="bg-[#003366] text-white text-sm">
        <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-bold text-base tracking-tight">TimeGovern</span>
            <span className="hidden sm:inline opacity-80">|</span>
            <span className="hidden sm:inline opacity-90">Clocks, Calendars & Time Tools</span>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* ===== Main navigation ===== */}
      <nav className="bg-[#0066cc] text-white text-sm shadow">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center gap-1 py-2">
            {["World Clock", "Time Zones", "Calendar", "Timers", "Sun & Moon", "Weather", "Calculators"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                className="px-3 py-1.5 rounded hover:bg-white/15 transition-colors font-medium"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ===== Hero current time (like timeanddate) ===== */}
      <div className="bg-white border-b" style={{ borderColor: "var(--tad-border)" }}>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center sm:text-left">
            <div className="text-sm text-gray-500 mb-1">Current Time</div>
            <div className="text-4xl sm:text-5xl font-light tracking-tight tabular-nums text-[#003366] dark:text-blue-300">
              {timeStr}
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-300 mt-1">
              {dateStr}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Your local time • Week {Math.ceil(((now - new Date(now.getFullYear(), 0, 1)) / 86400000 + 1) / 7)}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Main content ===== */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* Feature cards grid – timeanddate style */}
        <section>
          <h2 className="text-xl font-semibold text-[#003366] dark:text-blue-300 mb-4 border-b pb-2" style={{ borderColor: "var(--tad-border)" }}>
            Popular Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "World Clock", desc: "Current local time around the world.", href: "#world-clock" },
              { title: "Time Zone Converter", desc: "Calculate time difference between places.", href: "#clocks" },
              { title: "Calendar", desc: "Interactive monthly calendar.", href: "#calendar" },
              { title: "Countdown Timer", desc: "Countdown to any date and time.", href: "#countdown" },
              { title: "Sun & Moon", desc: "Sunrise, sunset, twilight & eclipses.", href: "#astronomy" },
              { title: "Business Calculators", desc: "Working days & deadline projector.", href: "#business" },
            ].map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="tad-card p-4 hover:shadow-md transition-shadow block"
              >
                <div className="font-semibold text-[#0066cc] mb-1">{item.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</div>
              </a>
            ))}
          </div>
        </section>

        {/* Full modules */}
        <section id="clocks">
          <Clocks />
        </section>

        <section id="world-clock">
          <WorldClocks />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="calendar">
          <Calendar />
          <div id="countdown">
            <Countdown />
          </div>
        </div>

        <section id="astronomy">
          <AstronomyModule lat={lat} lon={lon} />
        </section>

        <section id="business">
          <BusinessCalculators />
        </section>

        <section id="weather">
          <GeoNewsWeather onLocation={handleLocation} />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#003366] text-white mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <div>
              <span className="font-bold">TimeGovern.com</span>
              <span className="opacity-70 ml-2">— Clocks, Calendars & Time Tools</span>
            </div>
            <div className="opacity-70">
              © {new Date().getFullYear()} TimeGovern
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

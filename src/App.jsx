import { useState, useCallback } from "react";
import ThemeToggle from "./components/ThemeToggle";
import { TopBannerAd, SidebarAd } from "./components/AdPlaceholders";
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

  const handleLocation = useCallback((latitude, longitude) => {
    setLat(latitude);
    setLon(longitude);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      {/* ========== Premium Header ========== */}
      <header className="sticky top-0 z-50 border-b border-gray-200/70 dark:border-gray-800/80 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <span className="text-white font-bold text-sm">TG</span>
              </div>
              <div className="leading-tight">
                <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                  TimeGovern
                </span>
                <span className="hidden sm:inline text-xs text-gray-400 ml-1.5 font-medium">
                  .com
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300">
              <a href="#clocks" className="px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Clocks</a>
              <a href="#tools" className="px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Tools</a>
              <a href="#astronomy" className="px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Astronomy</a>
              <a href="#news" className="px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">News</a>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Top Banner Ad */}
      <div className="py-4 px-4">
        <TopBannerAd />
      </div>

      {/* ========== Main Layout ========== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar Ad */}
          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-20">
              <SidebarAd position="left" />
            </div>
          </aside>

          {/* Center Content */}
          <div className="lg:col-span-8 space-y-6">
            <div id="clocks">
              <Clocks />
            </div>

            <WorldClocks />

            <div id="tools" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Calendar />
              <Countdown />
            </div>

            <div id="astronomy">
              <AstronomyModule lat={lat} lon={lon} />
            </div>

            <BusinessCalculators />

            <div id="news">
              <GeoNewsWeather onLocation={handleLocation} />
            </div>
          </div>

          {/* Right Sidebar Ad */}
          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-20">
              <SidebarAd position="right" />
            </div>
          </aside>
        </div>

        {/* Mobile ads */}
        <div className="lg:hidden mt-10 space-y-6">
          <SidebarAd position="mobile-1" />
          <SidebarAd position="mobile-2" />
        </div>
      </main>

      {/* ========== Premium Footer ========== */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">TG</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">TimeGovern</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              © {new Date().getFullYear()} TimeGovern.com — Premium time, calendar & astronomy tools
            </p>
            <p className="text-xs text-gray-400">
              Built for professionals
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

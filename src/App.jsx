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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
              TimeGovern
            </span>
            <span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400">
              .com
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="py-4 px-4">
        <TopBannerAd />
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-24">
              <SidebarAd position="left" />
            </div>
          </aside>

          <div className="lg:col-span-8 space-y-6">
            <Clocks />
            <WorldClocks />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Calendar />
              <Countdown />
            </div>

            <AstronomyModule lat={lat} lon={lon} />
            <BusinessCalculators />
            <GeoNewsWeather onLocation={handleLocation} />
          </div>

          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-24">
              <SidebarAd position="right" />
            </div>
          </aside>
        </div>

        <div className="lg:hidden mt-8 space-y-6">
          <SidebarAd position="mobile-1" />
          <SidebarAd position="mobile-2" />
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          © {new Date().getFullYear()} TimeGovern.com — Premium time, calendar &
          astronomy tools.
        </p>
        <p className="mt-1 text-xs">
          Built with React + Vite · Deployed on Cloudflare Pages
        </p>
      </footer>
    </div>
  );
}

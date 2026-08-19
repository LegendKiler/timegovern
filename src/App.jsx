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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header – shadcn style */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center px-4 sm:px-6">
          <div className="mr-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
              TG
            </div>
            <span className="hidden font-bold sm:inline-block">
              TimeGovern
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#clocks" className="transition-colors hover:text-foreground/80 text-foreground/60">Clocks</a>
            <a href="#tools" className="transition-colors hover:text-foreground/80 text-foreground/60">Tools</a>
            <a href="#astronomy" className="transition-colors hover:text-foreground/80 text-foreground/60">Astronomy</a>
            <a href="#news" className="transition-colors hover:text-foreground/80 text-foreground/60">News</a>
          </nav>

          <div className="flex flex-1 items-center justify-end gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Top Banner */}
      <div className="container max-w-screen-2xl px-4 sm:px-6 py-4">
        <TopBannerAd />
      </div>

      {/* Main */}
      <main className="container max-w-screen-2xl px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-20">
              <SidebarAd position="left" />
            </div>
          </aside>

          <div className="lg:col-span-8 space-y-6">
            <section id="clocks">
              <Clocks />
            </section>

            <WorldClocks />

            <section id="tools" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Calendar />
              <Countdown />
            </section>

            <section id="astronomy">
              <AstronomyModule lat={lat} lon={lon} />
            </section>

            <BusinessCalculators />

            <section id="news">
              <GeoNewsWeather onLocation={handleLocation} />
            </section>
          </div>

          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-20">
              <SidebarAd position="right" />
            </div>
          </aside>
        </div>

        <div className="lg:hidden mt-10 space-y-6">
          <SidebarAd position="mobile-1" />
          <SidebarAd position="mobile-2" />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container max-w-screen-2xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-bold">
              TG
            </div>
            <span className="text-sm font-medium">TimeGovern</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TimeGovern.com — Professional time & calendar tools
          </p>
        </div>
      </footer>
    </div>
  );
}

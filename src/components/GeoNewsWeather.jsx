import { useEffect, useState, useCallback } from "react";
import { Cloud, Wind, MapPin, RefreshCw } from "lucide-react";

/**
 * Parse any standard RSS / Atom feed into clean articles
 */
function parseRSS(xmlText, sourceName = "News") {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, "text/xml");

    // Support both RSS <item> and Atom <entry>
    const items = [
      ...Array.from(doc.querySelectorAll("item")),
      ...Array.from(doc.querySelectorAll("entry")),
    ].slice(0, 8);

    return items.map((item) => {
      const title =
        item.querySelector("title")?.textContent?.trim() || "Untitled";
      const link =
        item.querySelector("link")?.getAttribute("href") ||
        item.querySelector("link")?.textContent ||
        "";
      const pubDate =
        item.querySelector("pubDate")?.textContent ||
        item.querySelector("updated")?.textContent ||
        item.querySelector("published")?.textContent ||
        "";
      const source =
        item.querySelector("source")?.textContent ||
        sourceName;

      // Clean Google-style titles that end with " - Source"
      const cleanTitle = title.replace(/\s+-\s+[^-]+$/, "").trim();

      return {
        title: cleanTitle || title,
        url: link,
        source: { name: source },
        publishedAt: pubDate ? new Date(pubDate).toISOString() : null,
        id: link || title,
      };
    });
  } catch (e) {
    console.warn("RSS parse failed for", sourceName, e);
    return [];
  }
}

/**
 * Free public RSS feeds – no API key required
 * These are the most reliable free sources available in 2026
 */
const FREE_FEEDS = [
  {
    name: "Google News",
    // Location-aware – we inject country later
    url: (country) =>
      `https://news.google.com/rss?hl=en-${country}&gl=${country.toUpperCase()}&ceid=${country.toUpperCase()}:en`,
  },
  {
    name: "BBC World",
    url: () => "https://feeds.bbci.co.uk/news/world/rss.xml",
  },
  {
    name: "Reuters",
    url: () => "https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best",
  },
  {
    name: "The Guardian",
    url: () => "https://www.theguardian.com/world/rss",
  },
  {
    name: "NPR",
    url: () => "https://feeds.npr.org/1001/rss.xml",
  },
  {
    name: "Al Jazeera",
    url: () => "https://www.aljazeera.com/xml/rss/all.xml",
  },
];

// Public CORS proxies (we try several for reliability)
const PROXIES = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

async function fetchFeed(feedUrl, sourceName) {
  for (const proxy of PROXIES) {
    try {
      const res = await fetch(proxy(feedUrl), { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const text = await res.text();
        return parseRSS(text, sourceName);
      }
    } catch (e) {
      // try next proxy
    }
  }
  return [];
}

export default function GeoNewsWeather({ onLocation }) {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch location + weather once
  useEffect(() => {
    async function initLocation() {
      setLoading(true);
      setError(null);
      try {
        const locRes = await fetch("https://ipapi.co/json/");
        if (!locRes.ok) throw new Error("Location lookup failed");
        const loc = await locRes.json();
        if (loc.error) throw new Error(loc.reason || "IP API error");

        const locData = {
          city: loc.city,
          region: loc.region,
          country: loc.country_name,
          countryCode: loc.country_code,
          lat: loc.latitude,
          lon: loc.longitude,
        };
        setLocation(locData);
        onLocation?.(locData.lat, locData.lon);

        // Weather
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,wind_speed_10m&timezone=auto`;
        const wRes = await fetch(weatherUrl);
        if (wRes.ok) {
          const wData = await wRes.json();
          setWeather({
            temp: wData.current?.temperature_2m,
            wind: wData.current?.wind_speed_10m,
            unit: wData.current_units?.temperature_2m || "°C",
            windUnit: wData.current_units?.wind_speed_10m || "km/h",
          });
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load location");
        onLocation?.(-33.8688, 151.2093);
      } finally {
        setLoading(false);
      }
    }
    initLocation();
  }, [onLocation]);

  // Fetch all free news sources
  const loadNews = useCallback(async (countryCode = "us") => {
    setNewsLoading(true);
    try {
      const country = (countryCode || "us").toLowerCase();

      const results = await Promise.allSettled(
        FREE_FEEDS.map((feed) =>
          fetchFeed(feed.url(country), feed.name)
        )
      );

      // Flatten + dedupe by URL / title
      const seen = new Set();
      const combined = [];

      results.forEach((r) => {
        if (r.status === "fulfilled") {
          r.value.forEach((article) => {
            const key = article.url || article.title;
            if (key && !seen.has(key)) {
              seen.add(key);
              combined.push(article);
            }
          });
        }
      });

      // Sort newest first
      combined.sort((a, b) => {
        const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return db - da;
      });

      setNews(combined.slice(0, 12)); // show top 12
      setLastUpdated(new Date());
    } catch (e) {
      console.warn("News refresh failed", e);
    } finally {
      setNewsLoading(false);
    }
  }, []);

  // Initial news load + auto-refresh every 45 seconds
  useEffect(() => {
    if (!location) return;

    loadNews(location.countryCode);

    // Auto-refresh every 45 seconds (safe for free proxies & RSS)
    // Updating every 1 second would break free proxies and is unnecessary
    const interval = setInterval(() => {
      loadNews(location.countryCode);
    }, 45000);

    return () => clearInterval(interval);
  }, [location, loadNews]);

  if (loading) {
    return (
      <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <p className="text-gray-500">Detecting your location…</p>
      </section>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-6">
      <h2 className="text-xl font-semibold">Local Weather & Live News</h2>

      {error && (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          {error} (using fallback location for astronomy)
        </p>
      )}

      {/* Location + Weather */}
      {location && (
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <MapPin className="w-5 h-5" />
            <span>
              {location.city}, {location.region}, {location.country}
            </span>
          </div>

          {weather && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Cloud className="w-5 h-5 text-blue-500" />
                <span className="font-semibold">
                  {weather.temp}
                  {weather.unit}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Wind className="w-4 h-4" />
                {weather.wind} {weather.windUnit}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Live News Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">Top Headlines</h3>
            {newsLoading && (
              <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>
            {lastUpdated && (
              <span>
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-3">
          Sources: Google News · BBC · Reuters · The Guardian · NPR · Al Jazeera
          (all free, auto-refresh every 45s)
        </p>

        {news.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {newsLoading
              ? "Loading headlines…"
              : "No headlines available right now. Will retry shortly."}
          </p>
        ) : (
          <ul className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {news.map((article, idx) => (
              <li key={article.id || idx}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                >
                  <div className="font-medium text-sm line-clamp-2">
                    {article.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-x-2">
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      {article.source?.name}
                    </span>
                    {article.publishedAt && (
                      <span>
                        · {new Date(article.publishedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

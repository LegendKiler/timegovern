import { useEffect, useState } from "react";
import { Cloud, Wind, MapPin } from "lucide-react";

/**
 * Parse Google News RSS XML into a simple article list
 */
function parseGoogleNewsRSS(xmlText) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, "text/xml");
    const items = Array.from(doc.querySelectorAll("item")).slice(0, 5);

    return items.map((item) => {
      const title = item.querySelector("title")?.textContent || "";
      const link = item.querySelector("link")?.textContent || "";
      const pubDate = item.querySelector("pubDate")?.textContent || "";
      const source = item.querySelector("source")?.textContent || "Google News";

      return {
        title: title.replace(/ - .*$/, "").trim(), // clean Google News title suffix
        url: link,
        source: { name: source },
        publishedAt: pubDate ? new Date(pubDate).toISOString() : null,
        origin: "google",
      };
    });
  } catch (e) {
    console.warn("Failed to parse Google News RSS", e);
    return [];
  }
}

export default function GeoNewsWeather({ onLocation }) {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [news, setNews] = useState([]);
  const [newsSource, setNewsSource] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function init() {
      setLoading(true);
      setError(null);

      try {
        // 1. IP → Location
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

        // 2. Weather (Open-Meteo)
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,wind_speed_10m&timezone=auto`;
        const wRes = await fetch(weatherUrl);
        if (!wRes.ok) throw new Error("Weather fetch failed");
        const wData = await wRes.json();
        setWeather({
          temp: wData.current?.temperature_2m,
          wind: wData.current?.wind_speed_10m,
          unit: wData.current_units?.temperature_2m || "°C",
          windUnit: wData.current_units?.wind_speed_10m || "km/h",
        });

        // 3. News – try both sources
        let articles = [];
        let sourceLabel = "";

        // --- A. NewsAPI.org (if key exists) ---
        const apiKey = import.meta.env.VITE_NEWS_API_KEY;
        if (apiKey && apiKey !== "your_newsapi_key_here") {
          try {
            const newsUrl = `https://newsapi.org/v2/top-headlines?country=${loc.country_code.toLowerCase()}&pageSize=5&apiKey=${apiKey}`;
            const nRes = await fetch(newsUrl);
            if (nRes.ok) {
              const nData = await nRes.json();
              if (nData.articles && nData.articles.length > 0) {
                articles = nData.articles.map((a) => ({
                  ...a,
                  origin: "newsapi",
                }));
                sourceLabel = "NewsAPI.org";
              }
            }
          } catch (e) {
            console.warn("NewsAPI.org failed", e);
          }
        }

        // --- B. Google News RSS (always free, no key) ---
        // Used as primary if no NewsAPI results, or as additional source
        try {
          // Country-specific Google News RSS
          const country = (loc.country_code || "us").toLowerCase();
          const googleRssUrl = `https://news.google.com/rss?hl=en-${country}&gl=${country.toUpperCase()}&ceid=${country.toUpperCase()}:en`;

          // Use a public CORS proxy so the browser can fetch the RSS
          // (Google RSS does not send CORS headers)
          const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(googleRssUrl)}`;

          const gRes = await fetch(proxyUrl);
          if (gRes.ok) {
            const xmlText = await gRes.text();
            const googleArticles = parseGoogleNewsRSS(xmlText);

            if (googleArticles.length > 0) {
              if (articles.length === 0) {
                // No NewsAPI results → use Google as main source
                articles = googleArticles;
                sourceLabel = "Google News";
              } else {
                // Both available → merge (NewsAPI first, then Google)
                articles = [...articles, ...googleArticles].slice(0, 8);
                sourceLabel = "NewsAPI.org + Google News";
              }
            }
          }
        } catch (e) {
          console.warn("Google News RSS failed", e);
        }

        setNews(articles);
        setNewsSource(sourceLabel);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load geo data");
        // Fallback location so astronomy still works
        onLocation?.(-33.8688, 151.2093);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [onLocation]);

  if (loading) {
    return (
      <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <p className="text-gray-500">Detecting your location…</p>
      </section>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-6">
      <h2 className="text-xl font-semibold">Local Weather & News</h2>

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

      {/* News section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Top Headlines</h3>
          {newsSource && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              via {newsSource}
            </span>
          )}
        </div>

        {news.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No headlines available right now. Google News is always free; add
            VITE_NEWS_API_KEY for extra NewsAPI.org results.
          </p>
        ) : (
          <ul className="space-y-3">
            {news.map((article, idx) => (
              <li key={idx}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                >
                  <div className="font-medium text-sm line-clamp-2">
                    {article.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    <span>{article.source?.name || "News"}</span>
                    {article.publishedAt && (
                      <span>
                        · {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                    {article.origin === "google" && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px]">
                        Google
                      </span>
                    )}
                    {article.origin === "newsapi" && (
                      <span className="px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-[10px]">
                        NewsAPI
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

import { useEffect, useState } from "react";
import { Cloud, Wind, MapPin } from "lucide-react";

export default function GeoNewsWeather({ onLocation }) {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function init() {
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

        const apiKey = import.meta.env.VITE_NEWS_API_KEY;
        if (apiKey && apiKey !== "your_newsapi_key_here") {
          const newsUrl = `https://newsapi.org/v2/top-headlines?country=${loc.country_code.toLowerCase()}&pageSize=5&apiKey=${apiKey}`;
          const nRes = await fetch(newsUrl);
          if (nRes.ok) {
            const nData = await nRes.json();
            setNews(nData.articles || []);
          } else {
            console.warn("NewsAPI returned", nRes.status);
            setNews([]);
          }
        } else {
          setNews([]);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load geo data");
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

      <div>
        <h3 className="font-medium mb-3">Top Headlines</h3>
        {news.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {import.meta.env.VITE_NEWS_API_KEY
              ? "No headlines available for your region."
              : "Add VITE_NEWS_API_KEY to enable local news."}
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
                  <div className="text-xs text-gray-500 mt-1">
                    {article.source?.name}
                    {article.publishedAt &&
                      ` · ${new Date(article.publishedAt).toLocaleDateString()}`}
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

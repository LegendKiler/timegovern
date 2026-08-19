# TimeGovern.com

Premium world clocks, calendars, astronomy tools, business calculators, and geo-targeted news & weather.

## Tech Stack

- React 18 + Vite + SWC
- Tailwind CSS (dark mode via class)
- date-fns + date-fns-tz
- suncalc
- Open-Meteo, ipapi.co, NewsAPI

## Local Development

```bash
npm install
cp .env.example .env   # add your NewsAPI key
npm run dev
```

## Deploy to Cloudflare Pages

1. Connect this repo in Cloudflare Pages
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add environment variable: `VITE_NEWS_API_KEY`

## Features

- Live analog + digital clocks with full timezone selector
- World clocks (NY, London, Tokyo, Sydney, Dubai, Paris)
- Interactive calendar + live countdown
- Solar times (sunrise/sunset + twilight) via SunCalc
- Working-day counter & deadline projector (US/UK/AU/NZ holidays 2026)
- Geo-targeted weather + top headlines
- Dark/light theme with localStorage persistence
- Ad placeholders ready for AdSense

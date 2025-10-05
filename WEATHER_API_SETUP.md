# Weather API Setup Instructions

To enable real-time weather data and forecasts, you need to set up API keys:

## 1. OpenWeatherMap API (for current weather & forecasts)

1. Go to https://openweathermap.org/api
2. Sign up for a free account
3. Get your API key from the dashboard
4. Replace `YOUR_API_KEY` in `src/pages/Index.tsx` with your actual API key

**Free tier includes:**
- Current weather data
- 5-day forecast
- 1,000 API calls per day

## 2. NewsAPI (for global hazard alerts)

1. Go to https://newsapi.org/
2. Sign up for a free account
3. Get your API key
4. Replace `YOUR_NEWS_API_KEY` in `src/pages/Index.tsx` with your actual API key

**Free tier includes:**
- 100 requests per day
- Access to news from the last month

## Alternative: Use environment variables (recommended for production)

Instead of hardcoding API keys, store them as environment variables:

1. Create a `.env` file in your project root
2. Add:
```
VITE_OPENWEATHER_API_KEY=your_openweather_key_here
VITE_NEWS_API_KEY=your_news_api_key_here
```
3. In your code, use: `import.meta.env.VITE_OPENWEATHER_API_KEY`

Note: The `.env` file should be added to `.gitignore` to keep your keys secure.

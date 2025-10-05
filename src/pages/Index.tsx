import { useState } from 'react';
import { toast } from 'sonner';
import StarField from '@/components/StarField';
import ParadeForm from '@/components/ParadeForm';
import WeatherDashboard from '@/components/WeatherDashboard';
import logo from '@/assets/logo.png';

interface WeatherData {
  precipitation: number;
  wind: number;
  humidity: number;
  temperature: number;
  city: string;
  eventName: string;
  date: string;
  description: string;
  alerts?: Array<{
    event: string;
    description: string;
  }>;
}

interface ForecastDay {
  date: string;
  temp: number;
  precipitation: number;
  wind: number;
  humidity: number;
  description: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [globalAlerts, setGlobalAlerts] = useState<string[]>([]);

  const fetchWeatherData = async (data: { city: string; eventName: string; date: string }) => {
    setIsLoading(true);
    
    try {
      // Geocode the city to get coordinates
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(data.city)}&format=json&limit=1`
      );
      const geocodeData = await geocodeResponse.json();
      
      if (!geocodeData || geocodeData.length === 0) {
        toast.error('City not found. Please try another city name.');
        setIsLoading(false);
        return;
      }

      const { lat, lon } = geocodeData[0];

      // Fetch current weather and forecast from OpenWeatherMap
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=a46e7d640088dc4cdb814db3a21104e0`
      );
      
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=a46e7d640088dc4cdb814db3a21104e0`
      );

      if (!weatherResponse.ok || !forecastResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const currentWeather = await weatherResponse.json();
      const forecastData = await forecastResponse.json();

      const weatherData: WeatherData = {
        precipitation: currentWeather.rain?.['1h'] || 0,
        wind: currentWeather.wind.speed,
        humidity: currentWeather.main.humidity,
        temperature: currentWeather.main.temp,
        city: data.city,
        eventName: data.eventName,
        date: data.date,
        description: currentWeather.weather[0].description,
        alerts: currentWeather.alerts,
      };

      // Process 5-day forecast (taking one reading per day at noon)
      const dailyForecasts: ForecastDay[] = [];
      const processedDates = new Set<string>();
      
      forecastData.list.forEach((item: any) => {
        const itemDate = new Date(item.dt * 1000).toLocaleDateString();
        if (!processedDates.has(itemDate) && dailyForecasts.length < 5) {
          processedDates.add(itemDate);
          dailyForecasts.push({
            date: itemDate,
            temp: item.main.temp,
            precipitation: item.rain?.['3h'] || 0,
            wind: item.wind.speed,
            humidity: item.main.humidity,
            description: item.weather[0].description,
          });
        }
      });

      setWeatherData(weatherData);
      setForecast(dailyForecasts);
      
      // Check for hazardous conditions
      checkAndNotifyHazards(weatherData);
      
      toast.success('Weather data retrieved successfully!');
    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast.error('Failed to fetch weather data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const checkAndNotifyHazards = (data: WeatherData) => {
    const alerts: string[] = [];
    
    if (data.wind > 50) {
      alerts.push('⚠️ EXTREME WIND WARNING: Hurricane-force winds detected!');
    } else if (data.wind > 30) {
      alerts.push('🌪️ Very Windy Conditions');
    }
    
    if (data.precipitation > 50) {
      alerts.push('⚠️ SEVERE RAIN WARNING: Heavy rainfall detected!');
    } else if (data.precipitation > 10) {
      alerts.push('🌧️ Very Rainy Conditions');
    }
    
    if (data.temperature < 5) {
      alerts.push('❄️ Very Cool Conditions');
    }
    
    if (data.temperature > 35) {
      alerts.push('☀️ Very Sunny & Hot Conditions');
    }
    
    if (data.alerts && data.alerts.length > 0) {
      data.alerts.forEach(alert => {
        alerts.push(`⚠️ ${alert.event}: ${alert.description}`);
      });
    }
    
    alerts.forEach(alert => toast.warning(alert, { duration: 5000 }));
  };

  const fetchGlobalAlerts = async () => {
    try {
      // Fetch global weather alerts/news
      const response = await fetch(
        'https://newsapi.org/v2/everything?q=hurricane+OR+tsunami+OR+cyclone+OR+tornado+OR+flood+OR+storm&sortBy=publishedAt&language=en&apiKey=a46e7d640088dc4cdb814db3a21104e0'
      );
      
      if (response.ok) {
        const data = await response.json();
        const recentAlerts = data.articles.slice(0, 5).map((article: any) => article.title);
        setGlobalAlerts(recentAlerts);
      }
    } catch (error) {
      console.error('Error fetching global alerts:', error);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarField />
      
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img src={logo} alt="SpaceShield Logo" className="w-16 h-16 md:w-20 md:h-20" />
            <h1 className="text-4xl md:text-6xl font-black neon-text">
              SpaceShield
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground mb-2">
            Parade Planner
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Powered by NASA POWER API • Real-time weather intelligence for safe event planning
          </p>
        </header>

        <div className="max-w-4xl mx-auto space-y-8">
          <ParadeForm onSubmit={fetchWeatherData} isLoading={isLoading} />
          
          {weatherData && <WeatherDashboard data={weatherData} forecast={forecast} />}
          
          {globalAlerts.length > 0 && (
            <div className="glow-card p-6 bg-destructive/10 border-destructive/30">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>🌍</span> Global Hazard Alerts
              </h3>
              <div className="space-y-2">
                {globalAlerts.map((alert, index) => (
                  <p key={index} className="text-sm text-muted-foreground">{alert}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        <footer className="text-center mt-16 text-sm text-muted-foreground">
          <p>Built for NASA Space Apps Challenge 2024</p>
          <p className="mt-2">Data source: NASA POWER Project • Geocoding: OpenStreetMap Nominatim</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;

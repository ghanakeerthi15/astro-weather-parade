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
  city: string;
  eventName: string;
  date: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

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
      const eventDate = new Date(data.date);
      const year = eventDate.getFullYear();
      const month = String(eventDate.getMonth() + 1).padStart(2, '0');
      const day = String(eventDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}${month}${day}`;

      // Fetch NASA POWER API data
      const nasaResponse = await fetch(
        `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=PRECTOTCORR,WS2M,RH2M&community=RE&longitude=${lon}&latitude=${lat}&start=${formattedDate}&end=${formattedDate}&format=JSON`
      );

      if (!nasaResponse.ok) {
        throw new Error('Failed to fetch weather data from NASA POWER API');
      }

      const nasaData = await nasaResponse.json();
      const parameters = nasaData.properties.parameter;

      const weatherData: WeatherData = {
        precipitation: parameters.PRECTOTCORR?.[formattedDate] || 0,
        wind: parameters.WS2M?.[formattedDate] || 0,
        humidity: parameters.RH2M?.[formattedDate] || 0,
        city: data.city,
        eventName: data.eventName,
        date: data.date,
      };

      setWeatherData(weatherData);
      toast.success('Weather data retrieved successfully!');
    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast.error('Failed to fetch weather data. Please try again.');
    } finally {
      setIsLoading(false);
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
          
          {weatherData && <WeatherDashboard data={weatherData} />}
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

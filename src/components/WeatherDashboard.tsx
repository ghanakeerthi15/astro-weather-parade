import { CloudRain, Wind, Droplets, AlertTriangle, CheckCircle2, Share2 } from 'lucide-react';
import WeatherCard from './WeatherCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface WeatherData {
  precipitation: number;
  wind: number;
  humidity: number;
  city: string;
  eventName: string;
  date: string;
}

interface WeatherDashboardProps {
  data: WeatherData;
}

const WeatherDashboard = ({ data }: WeatherDashboardProps) => {
  const getStatus = (value: number, thresholds: { warning: number; danger: number }): 'safe' | 'warning' | 'danger' => {
    if (value >= thresholds.danger) return 'danger';
    if (value >= thresholds.warning) return 'warning';
    return 'safe';
  };

  const precipStatus = getStatus(data.precipitation, { warning: 5, danger: 10 });
  const windStatus = getStatus(data.wind, { warning: 20, danger: 30 });
  const humidityStatus = getStatus(data.humidity, { warning: 70, danger: 85 });

  const isParadeSafe = precipStatus === 'safe' && windStatus === 'safe' && humidityStatus === 'safe';
  const hasWarnings = precipStatus === 'warning' || windStatus === 'warning' || humidityStatus === 'warning';
  const hasDangers = precipStatus === 'danger' || windStatus === 'danger' || humidityStatus === 'danger';

  const handleShare = () => {
    const shareText = `SpaceShield Parade Forecast for ${data.eventName} in ${data.city} on ${data.date}: ${isParadeSafe ? '✅ Parade-Safe!' : '⚠️ Weather Caution Advised'}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'SpaceShield Parade Forecast',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Forecast copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="glow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold neon-text">{data.eventName}</h3>
            <p className="text-muted-foreground">{data.city} • {new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
            className="border-primary/30 hover:bg-primary/10"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        <div className={`flex items-center gap-3 p-4 rounded-lg ${
          isParadeSafe ? 'bg-primary/10 border border-primary/30' :
          hasDangers ? 'bg-destructive/10 border border-destructive/30' :
          'bg-yellow-500/10 border border-yellow-500/30'
        }`}>
          {isParadeSafe ? (
            <CheckCircle2 className="w-8 h-8 text-primary flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0 animate-pulse" />
          )}
          <div>
            <p className="font-bold text-lg">
              {isParadeSafe ? 'Parade-Safe Conditions!' : hasDangers ? 'High Risk Conditions' : 'Moderate Risk Conditions'}
            </p>
            <p className="text-sm text-muted-foreground">
              {isParadeSafe 
                ? 'Weather conditions are favorable for your event.' 
                : hasDangers 
                  ? 'Consider rescheduling or preparing backup plans.' 
                  : 'Monitor weather closely and have contingency plans ready.'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <WeatherCard
          icon={CloudRain}
          label="Precipitation"
          value={data.precipitation.toFixed(1)}
          unit="mm"
          status={precipStatus}
        />
        <WeatherCard
          icon={Wind}
          label="Wind Speed"
          value={data.wind.toFixed(1)}
          unit="m/s"
          status={windStatus}
        />
        <WeatherCard
          icon={Droplets}
          label="Humidity"
          value={data.humidity.toFixed(0)}
          unit="%"
          status={humidityStatus}
        />
      </div>

      <div className="glow-card p-6 bg-primary/5">
        <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
          <span className="text-primary">🌍</span> Eco-Insight
        </h4>
        <p className="text-sm text-muted-foreground">
          {data.precipitation > 10 
            ? 'Heavy precipitation can help reduce air pollutants and improve air quality naturally.' 
            : data.wind > 20 
              ? 'High wind speeds can disperse air pollution, contributing to better air quality in urban areas.'
              : 'Moderate conditions support sustainable outdoor events with minimal environmental impact.'}
        </p>
      </div>
    </div>
  );
};

export default WeatherDashboard;

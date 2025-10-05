import { LucideIcon } from 'lucide-react';

interface WeatherCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  unit: string;
  status: 'safe' | 'warning' | 'danger';
}

const WeatherCard = ({ icon: Icon, label, value, unit, status }: WeatherCardProps) => {
  const statusColors = {
    safe: 'border-primary/50',
    warning: 'border-yellow-500/50',
    danger: 'border-destructive/50',
  };

  const statusGlow = {
    safe: 'shadow-[0_0_20px_hsl(var(--primary)/0.3)]',
    warning: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]',
    danger: 'shadow-[0_0_20px_hsl(var(--destructive)/0.3)]',
  };

  return (
    <div className={`glow-card p-6 ${statusColors[status]} ${statusGlow[status]}`}>
      <div className="flex items-start justify-between mb-4">
        <Icon className="w-8 h-8 text-primary" />
        <span className={`text-xs font-semibold px-2 py-1 rounded ${
          status === 'safe' ? 'bg-primary/20 text-primary' :
          status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-destructive/20 text-destructive'
        }`}>
          {status.toUpperCase()}
        </span>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground uppercase tracking-wider">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold neon-text">{value}</span>
          <span className="text-lg text-muted-foreground">{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;

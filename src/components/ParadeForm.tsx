import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Rocket } from 'lucide-react';

interface ParadeFormProps {
  onSubmit: (data: { city: string; eventName: string; date: string }) => void;
  isLoading: boolean;
}

const ParadeForm = ({ onSubmit, isLoading }: ParadeFormProps) => {
  const [city, setCity] = useState('');
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ city, eventName, date });
  };

  return (
    <form onSubmit={handleSubmit} className="glow-card p-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
          <Rocket className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold neon-text">Plan Your Parade</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-foreground">City Location</Label>
          <Input
            id="city"
            placeholder="Enter city name (e.g., New York)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="bg-input/50 border-border/50 focus:border-primary transition-colors"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="event" className="text-foreground">Event Name</Label>
          <Input
            id="event"
            placeholder="Enter parade or event name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
            className="bg-input/50 border-border/50 focus:border-primary transition-colors"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" className="text-foreground">Event Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="bg-input/50 border-border/50 focus:border-primary transition-colors"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg animate-pulse-glow"
      >
        {isLoading ? 'Analyzing Weather Data...' : 'Get Weather Forecast'}
      </Button>
    </form>
  );
};

export default ParadeForm;

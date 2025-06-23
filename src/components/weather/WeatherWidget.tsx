
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  Wind,
  Thermometer,
  Droplets,
  Eye,
  Gauge,
  Navigation,
  RefreshCw,
  MapPin,
  Calendar,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherData {
  location: string;
  current: {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    pressure: number;
    visibility: number;
    uvIndex: number;
    feelsLike: number;
    icon: string;
  };
  forecast: Array<{
    date: string;
    high: number;
    low: number;
    condition: string;
    precipitation: number;
    icon: string;
  }>;
  hourly: Array<{
    time: string;
    temp: number;
    condition: string;
    precipitation: number;
    icon: string;
  }>;
}

const houstonCities = [
  { name: 'Houston', lat: 29.7604, lon: -95.3698 },
  { name: 'Katy', lat: 29.7858, lon: -95.8244 },
  { name: 'Sugar Land', lat: 29.6196, lon: -95.6349 },
  { name: 'Pearland', lat: 29.5638, lon: -95.2861 },
  { name: 'The Woodlands', lat: 30.1588, lon: -95.4513 },
  { name: 'Cypress', lat: 29.9691, lon: -95.6971 },
  { name: 'Spring', lat: 30.0799, lon: -95.4171 },
  { name: 'Humble', lat: 29.9988, lon: -95.2621 },
  { name: 'Tomball', lat: 30.0971, lon: -95.6160 },
  { name: 'Conroe', lat: 30.3118, lon: -95.4560 }
];

const getWeatherIcon = (condition: string, isDay: boolean = true) => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    return <CloudRain className="w-6 h-6 text-blue-500" />;
  }
  if (conditionLower.includes('snow')) {
    return <CloudSnow className="w-6 h-6 text-blue-200" />;
  }
  if (conditionLower.includes('cloud')) {
    return <Cloud className="w-6 h-6 text-gray-500" />;
  }
  if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
    return <Sun className="w-6 h-6 text-yellow-500" />;
  }
  return <Sun className="w-6 h-6 text-yellow-500" />;
};

export function WeatherWidget() {
  const [selectedCity, setSelectedCity] = useState(houstonCities[0]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchWeatherData = async (city: typeof houstonCities[0]) => {
    try {
      setLoading(true);
      setError(null);
      
      // Using OpenWeatherMap API (free tier)
      const API_KEY = 'demo'; // In production, this would come from environment variables
      
      // Mock data for demonstration (in production, replace with actual API calls)
      const mockWeatherData: WeatherData = {
        location: city.name,
        current: {
          temp: Math.round(75 + Math.random() * 20),
          condition: ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
          humidity: Math.round(60 + Math.random() * 30),
          windSpeed: Math.round(5 + Math.random() * 15),
          windDirection: Math.round(Math.random() * 360),
          pressure: Math.round(29.8 + Math.random() * 0.4),
          visibility: Math.round(8 + Math.random() * 2),
          uvIndex: Math.round(3 + Math.random() * 5),
          feelsLike: Math.round(77 + Math.random() * 18),
          icon: 'clear'
        },
        forecast: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          high: Math.round(80 + Math.random() * 15),
          low: Math.round(65 + Math.random() * 10),
          condition: ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
          precipitation: Math.round(Math.random() * 40),
          icon: 'clear'
        })),
        hourly: Array.from({ length: 24 }, (_, i) => ({
          time: new Date(Date.now() + i * 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: 'numeric' }),
          temp: Math.round(70 + Math.random() * 20),
          condition: ['Clear', 'Partly Cloudy', 'Cloudy'][Math.floor(Math.random() * 3)],
          precipitation: Math.round(Math.random() * 30),
          icon: 'clear'
        }))
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWeatherData(mockWeatherData);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error('Weather API error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(selectedCity);
  }, [selectedCity]);

  const handleCityChange = (cityName: string) => {
    const city = houstonCities.find(c => c.name === cityName);
    if (city) {
      setSelectedCity(city);
    }
  };

  const handleRefresh = () => {
    fetchWeatherData(selectedCity);
  };

  if (loading) {
    return (
      <Card className="h-[600px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Weather Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[500px]">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading weather data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-[600px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Weather Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[500px]">
            <div className="text-center">
              <Cloud className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px]">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Weather Forecast
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedCity.name} onValueChange={handleCityChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {houstonCities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {city.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="current" className="h-[480px]">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="hourly">Hourly</TabsTrigger>
            <TabsTrigger value="forecast">7-Day</TabsTrigger>
            <TabsTrigger value="radar">Radar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Weather */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {getWeatherIcon(weatherData?.current.condition || '')}
                  <div>
                    <div className="text-3xl font-bold">{weatherData?.current.temp}°F</div>
                    <div className="text-muted-foreground">{weatherData?.current.condition}</div>
                    <div className="text-sm text-muted-foreground">
                      Feels like {weatherData?.current.feelsLike}°F
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="text-sm font-medium">{weatherData?.current.humidity}%</div>
                      <div className="text-xs text-muted-foreground">Humidity</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium">{weatherData?.current.windSpeed} mph</div>
                      <div className="text-xs text-muted-foreground">Wind Speed</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-purple-500" />
                    <div>
                      <div className="text-sm font-medium">{weatherData?.current.pressure}"</div>
                      <div className="text-xs text-muted-foreground">Pressure</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-green-500" />
                    <div>
                      <div className="text-sm font-medium">{weatherData?.current.visibility} mi</div>
                      <div className="text-xs text-muted-foreground">Visibility</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Weather Alerts */}
              <div className="space-y-3">
                <h4 className="font-medium">Weather Alerts</h4>
                <div className="space-y-2">
                  <Badge variant="secondary" className="w-full justify-start">
                    <Sun className="w-3 h-3 mr-2" />
                    UV Index: {weatherData?.current.uvIndex} (Moderate)
                  </Badge>
                  <Badge variant="outline" className="w-full justify-start">
                    <Wind className="w-3 h-3 mr-2" />
                    Wind from {weatherData?.current.windDirection}°
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="hourly" className="mt-4">
            <div className="space-y-4">
              <h4 className="font-medium">24-Hour Forecast</h4>
              <div className="grid grid-cols-6 gap-3 max-h-[380px] overflow-y-auto">
                {weatherData?.hourly.map((hour, index) => (
                  <div key={index} className="text-center p-3 rounded-lg border">
                    <div className="text-xs text-muted-foreground mb-2">{hour.time}</div>
                    <div className="flex justify-center mb-2">
                      {getWeatherIcon(hour.condition)}
                    </div>
                    <div className="font-medium">{hour.temp}°</div>
                    <div className="text-xs text-blue-500">{hour.precipitation}%</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="forecast" className="mt-4">
            <div className="space-y-4">
              <h4 className="font-medium">7-Day Forecast</h4>
              <div className="space-y-2 max-h-[380px] overflow-y-auto">
                {weatherData?.forecast.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      {getWeatherIcon(day.condition)}
                      <div>
                        <div className="font-medium">{day.date}</div>
                        <div className="text-sm text-muted-foreground">{day.condition}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-blue-500">{day.precipitation}%</div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-red-500" />
                        <span className="font-medium">{day.high}°</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingDown className="w-3 h-3 text-blue-500" />
                        <span className="text-muted-foreground">{day.low}°</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="radar" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Weather Radar</h4>
                <Badge variant="outline">Live</Badge>
              </div>
              <div className="relative h-[380px] bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">Interactive Radar Map</h3>
                    <p className="text-muted-foreground mb-4">
                      Live weather radar for {selectedCity.name}, TX
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Light Precipitation</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Moderate Precipitation</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Heavy Precipitation</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Simulated radar overlay */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-green-500 rounded-full opacity-60 animate-pulse"></div>
                  <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-yellow-500 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute bottom-1/4 left-1/2 w-8 h-8 bg-blue-500 rounded-full opacity-80 animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

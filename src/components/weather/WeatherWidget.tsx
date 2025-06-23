
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
  TrendingDown,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WeatherService } from '@/services/weatherService';
import { useToast } from '@/components/ui/use-toast';

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
  alerts?: Array<{
    headline: string;
    desc: string;
    severity: string;
  }>;
  airQuality?: {
    aqi: number;
    pm25: number;
    pm10: number;
    o3: number;
  };
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

const getWeatherIcon = (condition: string, iconUrl?: string) => {
  if (iconUrl) {
    return <img src={`https:${iconUrl}`} alt={condition} className="w-6 h-6" />;
  }
  
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
  const { toast } = useToast();

  const fetchWeatherData = async (city: typeof houstonCities[0]) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await WeatherService.getWeatherData(city.lat, city.lon, city.name);
      setWeatherData(data);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      toast({
        title: "Weather Data Error",
        description: errorMessage,
        variant: "destructive"
      });
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
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
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

  const airQualityInfo = weatherData?.airQuality ? WeatherService.getAirQualityLevel(weatherData.airQuality.aqi) : null;
  const uvIndexInfo = WeatherService.getUVIndexLevel(weatherData?.current.uvIndex || 0);

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
            {/* Weather Alerts */}
            {weatherData?.alerts && weatherData.alerts.length > 0 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-orange-800">Weather Alert</span>
                </div>
                <p className="text-sm text-orange-700">{weatherData.alerts[0].headline}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Weather */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {getWeatherIcon(weatherData?.current.condition || '', weatherData?.current.icon)}
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
              
              {/* Weather Details */}
              <div className="space-y-3">
                <h4 className="font-medium">Weather Details</h4>
                <div className="space-y-2">
                  <Badge variant="secondary" className="w-full justify-start">
                    <Sun className="w-3 h-3 mr-2" />
                    UV Index: {weatherData?.current.uvIndex} ({uvIndexInfo.level})
                  </Badge>
                  <Badge variant="outline" className="w-full justify-start">
                    <Wind className="w-3 h-3 mr-2" />
                    Wind from {weatherData?.current.windDirection}°
                  </Badge>
                  {airQualityInfo && (
                    <Badge variant="outline" className="w-full justify-start">
                      <Cloud className="w-3 h-3 mr-2" />
                      Air Quality: {weatherData?.airQuality?.aqi} ({airQualityInfo.level})
                    </Badge>
                  )}
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
                      {getWeatherIcon(hour.condition, hour.icon)}
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
                      {getWeatherIcon(day.condition, day.icon)}
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
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

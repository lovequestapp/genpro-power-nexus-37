
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Thermometer,
  Droplets,
  Eye,
  Gauge,
  RefreshCw,
  MapPin,
  Satellite,
  Zap,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock
} from 'lucide-react';
import { WeatherWidget } from '@/components/weather/WeatherWidget';
import SEO from '@/components/SEO';

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
  { name: 'Conroe', lat: 30.3118, lon: -95.4560 },
  { name: 'Baytown', lat: 29.7355, lon: -94.9774 },
  { name: 'Pasadena', lat: 29.6911, lon: -95.2091 }
];

interface WeatherAlert {
  id: string;
  type: 'warning' | 'watch' | 'advisory';
  title: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  expires: Date;
}

export default function WeatherPage() {
  const [selectedCity, setSelectedCity] = useState(houstonCities[0]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock weather alerts
    setAlerts([
      {
        id: '1',
        type: 'advisory',
        title: 'Heat Advisory',
        description: 'Hot temperatures and high humidity may cause heat-related illnesses.',
        severity: 'moderate',
        expires: new Date(Date.now() + 6 * 60 * 60 * 1000)
      },
      {
        id: '2',
        type: 'watch',
        title: 'Thunderstorm Watch',
        description: 'Conditions favorable for severe thunderstorms with damaging winds and hail.',
        severity: 'severe',
        expires: new Date(Date.now() + 12 * 60 * 60 * 1000)
      }
    ]);
  }, [selectedCity]);

  const handleCityChange = (cityName: string) => {
    const city = houstonCities.find(c => c.name === cityName);
    if (city) {
      setSelectedCity(city);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'moderate': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'severe': return 'bg-red-100 text-red-800 border-red-200';
      case 'extreme': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      <SEO 
        title="Weather Dashboard | HOU GEN PROS Admin" 
        description="Live weather radar, forecasts, and alerts for Houston and surrounding areas." 
        canonical="/admin/weather" 
        pageType="website" 
        keywords="weather, forecast, radar, houston, texas" 
        schema={null} 
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Weather Dashboard</h1>
              <p className="text-slate-600 mt-1">Live weather conditions, forecasts, and alerts for Houston area</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedCity.name} onValueChange={handleCityChange}>
                <SelectTrigger className="w-[200px]">
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
            </div>
          </div>

          {/* Weather Alerts */}
          {alerts.length > 0 && (
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="w-5 h-5" />
                  Active Weather Alerts ({alerts.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="uppercase text-xs">
                              {alert.type}
                            </Badge>
                            <Badge variant="secondary" className="capitalize">
                              {alert.severity}
                            </Badge>
                          </div>
                          <h4 className="font-semibold mb-1">{alert.title}</h4>
                          <p className="text-sm mb-2">{alert.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>Expires: {alert.expires.toLocaleString()}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Weather Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Primary Weather Widget */}
            <div className="xl:col-span-2">
              <WeatherWidget />
            </div>

            {/* Additional Weather Information */}
            <div className="space-y-6">
              {/* Air Quality */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Wind className="w-5 h-5" />
                    Air Quality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">42</div>
                      <div className="text-sm text-muted-foreground">AQI</div>
                      <Badge variant="outline" className="mt-2 bg-green-50 text-green-700">
                        Good
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>PM2.5</span>
                        <span className="font-medium">8 μg/m³</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>PM10</span>
                        <span className="font-medium">15 μg/m³</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Ozone</span>
                        <span className="font-medium">62 μg/m³</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Satellite View */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Satellite className="w-5 h-5" />
                    Satellite View
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-gradient-to-br from-blue-100 to-green-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center">
                      <Satellite className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Interactive satellite view
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedCity.name}, TX
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Storm Tracker */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Storm Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Lightning Strikes</span>
                      <span className="font-medium">12 (last hour)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Storm Cells</span>
                      <span className="font-medium">2 active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Nearest Storm</span>
                      <span className="font-medium">25 mi NE</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Zap className="w-4 h-4 mr-2" />
                      Track Storms
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Historical Weather Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Historical Weather Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-500">103°F</div>
                  <div className="text-sm text-muted-foreground">Record High</div>
                  <div className="text-xs text-muted-foreground mt-1">July 15, 2023</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">42°F</div>
                  <div className="text-sm text-muted-foreground">Record Low</div>
                  <div className="text-xs text-muted-foreground mt-1">January 8, 2024</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-500">8.5"</div>
                  <div className="text-sm text-muted-foreground">Max Rainfall</div>
                  <div className="text-xs text-muted-foreground mt-1">August 22, 2023</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

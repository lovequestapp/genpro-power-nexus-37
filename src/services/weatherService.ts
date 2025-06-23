
import { supabase } from '@/lib/supabase';

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
    urgency: string;
    areas: string;
    category: string;
    certainty: string;
    event: string;
  }>;
  airQuality?: {
    aqi: number;
    pm25: number;
    pm10: number;
    o3: number;
  };
}

export class WeatherService {
  static async getWeatherData(lat: number, lon: number, location: string): Promise<WeatherData> {
    try {
      const { data, error } = await supabase.functions.invoke('weather-api', {
        body: { lat, lon, location },
      });

      if (error) {
        console.error('Weather service error:', error);
        throw new Error('Failed to fetch weather data');
      }

      return data;
    } catch (error) {
      console.error('Weather API error:', error);
      throw error;
    }
  }

  static getAirQualityLevel(aqi: number): { level: string; color: string } {
    if (aqi <= 50) return { level: 'Good', color: 'text-green-600' };
    if (aqi <= 100) return { level: 'Moderate', color: 'text-yellow-600' };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: 'text-orange-600' };
    if (aqi <= 200) return { level: 'Unhealthy', color: 'text-red-600' };
    if (aqi <= 300) return { level: 'Very Unhealthy', color: 'text-purple-600' };
    return { level: 'Hazardous', color: 'text-red-800' };
  }

  static getUVIndexLevel(uvIndex: number): { level: string; color: string } {
    if (uvIndex <= 2) return { level: 'Low', color: 'text-green-600' };
    if (uvIndex <= 5) return { level: 'Moderate', color: 'text-yellow-600' };
    if (uvIndex <= 7) return { level: 'High', color: 'text-orange-600' };
    if (uvIndex <= 10) return { level: 'Very High', color: 'text-red-600' };
    return { level: 'Extreme', color: 'text-purple-600' };
  }
}

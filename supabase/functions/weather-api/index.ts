
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { searchParams } = new URL(req.url)
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')
    const location = searchParams.get('location')
    
    if (!lat || !lon) {
      return new Response('Missing lat/lon parameters', { 
        status: 400, 
        headers: corsHeaders 
      })
    }

    const weatherApiKey = Deno.env.get('WEATHERAPI_KEY')
    if (!weatherApiKey) {
      return new Response('WeatherAPI key not configured', { 
        status: 500, 
        headers: corsHeaders 
      })
    }

    // Fetch current weather
    const currentResponse = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${lat},${lon}&aqi=yes`
    )
    
    if (!currentResponse.ok) {
      throw new Error(`Weather API error: ${currentResponse.status}`)
    }
    
    const currentData = await currentResponse.json()

    // Fetch forecast
    const forecastResponse = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${lat},${lon}&days=7&aqi=yes&alerts=yes`
    )
    
    if (!forecastResponse.ok) {
      throw new Error(`Forecast API error: ${forecastResponse.status}`)
    }
    
    const forecastData = await forecastResponse.json()

    // Transform data to match our expected format
    const weatherData = {
      location: location || currentData.location.name,
      current: {
        temp: Math.round(currentData.current.temp_f),
        condition: currentData.current.condition.text,
        humidity: currentData.current.humidity,
        windSpeed: Math.round(currentData.current.wind_mph),
        windDirection: currentData.current.wind_degree,
        pressure: currentData.current.pressure_in,
        visibility: currentData.current.vis_miles,
        uvIndex: currentData.current.uv,
        feelsLike: Math.round(currentData.current.feelslike_f),
        icon: currentData.current.condition.icon,
      },
      forecast: forecastData.forecast.forecastday.map((day: any) => ({
        date: new Date(day.date).toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        high: Math.round(day.day.maxtemp_f),
        low: Math.round(day.day.mintemp_f),
        condition: day.day.condition.text,
        precipitation: day.day.daily_chance_of_rain,
        icon: day.day.condition.icon,
      })),
      hourly: forecastData.forecast.forecastday[0].hour.slice(0, 24).map((hour: any) => ({
        time: new Date(hour.time).toLocaleTimeString('en-US', { hour: 'numeric' }),
        temp: Math.round(hour.temp_f),
        condition: hour.condition.text,
        precipitation: hour.chance_of_rain,
        icon: hour.condition.icon,
      })),
      alerts: forecastData.alerts?.alert || [],
      airQuality: {
        aqi: currentData.current.air_quality['us-epa-index'],
        pm25: currentData.current.air_quality.pm2_5,
        pm10: currentData.current.air_quality.pm10,
        o3: currentData.current.air_quality.o3,
      }
    }

    return new Response(JSON.stringify(weatherData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Weather API error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

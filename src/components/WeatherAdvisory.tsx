import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Clock,
  Calendar,
  CloudRain,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { WeatherData, LanguageCode } from '../types';

interface WeatherAdvisoryProps {
  currentLang: LanguageCode;
}

export const WeatherAdvisory: React.FC<WeatherAdvisoryProps> = ({ currentLang }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCity, setSelectedCity] = useState<string>('Central Agricultural Zone');

  const fetchWeather = async (city: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/weather?location=${encodeURIComponent(city)}`);
      const data = await res.json();
      if (data.success && data.weather) {
        setWeatherData(data.weather);
      }
    } catch (e) {
      console.error('Error fetching weather:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedCity);
  }, [selectedCity]);

  const agriculturalZones = [
    'Central Agricultural Zone (MP / Vidarbha)',
    'North Indo-Gangetic Plains (Punjab / Haryana)',
    'Western Semi-Arid Belt (Rajasthan / Gujarat)',
    'Eastern Deltaic Region (UP / Bihar / WB)',
    'Southern Deccan Plateau (Telangana / Karnataka)',
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-teal-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 text-xs font-semibold mb-3">
            <CloudSun className="w-3.5 h-3.5" />
            <span>Agro-Meteorology &amp; Spray Timing • मौसम व कृषि सलाह</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Weather Intelligence &amp; Spray Windows
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-sky-100/90 leading-relaxed">
            Never waste expensive pesticides or fertilizers. Check wind speed, dew point, rainfall probability, and optimal morning spraying hours.
          </p>
        </div>

        {/* Location selector */}
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
          <label className="block text-[11px] font-semibold text-sky-200 mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Select Farming Agro-Climatic Zone:
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full text-xs font-bold text-stone-900 bg-white rounded-xl px-3 py-2 border-0 focus:ring-2 focus:ring-sky-400"
          >
            {agriculturalZones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>
      </div>

      {weatherData && (
        <>
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-stone-500">Temperature</span>
                <Thermometer className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-black text-stone-900">
                {weatherData.current.temperature}°C
              </p>
              <p className="text-[11px] text-stone-400 mt-1">
                Feels like {weatherData.current.feelsLike}°C
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-stone-500">Relative Humidity</span>
                <Droplets className="w-4 h-4 text-sky-600" />
              </div>
              <p className="text-2xl font-black text-stone-900">
                {weatherData.current.humidity}%
              </p>
              <p className="text-[11px] text-stone-400 mt-1">
                Dew point {weatherData.current.dewPoint}°C
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-stone-500">Wind Velocity</span>
                <Wind className="w-4 h-4 text-teal-600" />
              </div>
              <p className="text-2xl font-black text-stone-900">
                {weatherData.current.windSpeedKm} <span className="text-xs font-normal">km/h</span>
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                Safe for knapsack spray
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-stone-500">Rain Probability</span>
                <CloudRain className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-black text-stone-900">
                {weatherData.current.precipitationProb}%
              </p>
              <p className="text-[11px] text-stone-400 mt-1">
                Soil Moisture: {weatherData.current.soilMoistureEstimate}
              </p>
            </div>
          </div>

          {/* SPRAY WINDOW STATUS HIGHLIGHT */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Pesticide &amp; Nutrient Spray Advisory:
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-200 text-emerald-900">
                      {weatherData.current.sprayWindowStatus}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-950 font-medium mt-1 leading-relaxed">
                    {weatherData.current.sprayRecommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hourly Spray Guide Table */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>Today's Hour-by-Hour Spray Suitability Index</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {weatherData.hourlyAdvisories.map((hour, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    hour.sprayFit
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : 'bg-stone-50 border-stone-200 text-stone-500'
                  }`}
                >
                  <p className="text-xs font-bold">{hour.time}</p>
                  <p className="text-lg font-black my-1">{hour.temp}°C</p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      hour.sprayFit
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {hour.sprayFit ? 'Ideal Spray' : 'Avoid Spray'}
                  </span>
                  {hour.reason && (
                    <p className="text-[9px] text-stone-500 mt-1">{hour.reason}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Agricultural Outlook */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>7-Day Farm Weather &amp; Irrigation Forecast</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
              {weatherData.sevenDayForecast.map((day, idx) => (
                <div
                  key={idx}
                  className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-center flex flex-col justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-stone-800">{day.day}</p>
                    <p className="text-[11px] text-stone-500 my-1">{day.condition}</p>
                    <p className="text-sm font-extrabold text-stone-900">
                      {day.maxTemp}° / <span className="text-xs text-stone-500">{day.minTemp}°</span>
                    </p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-stone-200">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded block truncate ${
                        day.rainMm > 5
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {day.alert}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Agro Alerts */}
          {weatherData.farmingAlerts && weatherData.farmingAlerts.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Weather Action Alerts for Farmers:
              </h3>
              {weatherData.farmingAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    alert.type === 'warning'
                      ? 'bg-amber-50 border-amber-300 text-amber-950'
                      : 'bg-blue-50 border-blue-300 text-blue-950'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase">{alert.title}</h4>
                    <p className="text-xs font-medium mt-0.5 leading-relaxed">
                      {alert.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

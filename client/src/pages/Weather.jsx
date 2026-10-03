import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CloudSun, Droplets, MapPin, Plus, RefreshCw, Wind } from "lucide-react";
import { getFarmForecast } from "../services/farmWeather";

const OBSERVATIONS_KEY = "khetwise_weather_observations";

function readObservations() {
  try {
    const saved = JSON.parse(localStorage.getItem(OBSERVATIONS_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function readFarm() {
  try {
    return JSON.parse(localStorage.getItem("khetwise_farm") || "null");
  } catch {
    return null;
  }
}

export default function Weather() {
  const [farm, setFarm] = useState(readFarm);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [forecastError, setForecastError] = useState("");
  const [observations, setObservations] = useState(readObservations);
  const [form, setForm] = useState({ temperature: "", rainfall: "", humidity: "", condition: "Clear" });
  const [formError, setFormError] = useState("");

  const loadForecast = useCallback(async (forceRefresh = false) => {
    if (!farm?.location) return;
    setLoading(true);
    setForecastError("");
    try {
      setForecast(await getFarmForecast(farm.location, { forceRefresh }));
    } catch (error) {
      setForecastError(error.message || "Weather forecast is unavailable right now.");
    } finally {
      setLoading(false);
    }
  }, [farm?.location]);

  useEffect(() => {
    loadForecast();
  }, [loadForecast]);

  useEffect(() => {
    const refreshFarm = () => setFarm(readFarm());
    window.addEventListener("storage", refreshFarm);
    return () => window.removeEventListener("storage", refreshFarm);
  }, []);

  const saveObservation = (event) => {
    event.preventDefault();
    if ([form.temperature, form.rainfall, form.humidity].some((value) => value === "" || !Number.isFinite(Number(value)))) {
      setFormError("Enter valid temperature, rainfall, and humidity measurements.");
      return;
    }
    const observation = { ...form, id: Date.now(), recordedAt: new Date().toISOString() };
    const next = [observation, ...observations].slice(0, 20);
    localStorage.setItem(OBSERVATIONS_KEY, JSON.stringify(next));
    setObservations(next);
    setForm({ temperature: "", rainfall: "", humidity: "", condition: "Clear" });
    setFormError("");
  };

  const latest = observations[0];

  return (
    <main className="min-h-screen bg-[#f5f8f3] px-5 py-8 text-[#102018] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link to="/dashboard" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-green-800 hover:text-green-950"><ArrowLeft size={17} /> Back to Dashboard</Link>
        <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-sm font-semibold text-green-700">Local forecast & field conditions</p><h1 className="mt-1 text-3xl font-bold sm:text-4xl">Farm Weather</h1><p className="mt-2 text-black/55">{farm?.location ? `${farm.location}${farm.area ? ` · ${farm.area} acres` : ""}` : "Add a farm location to get a local forecast."}</p></div>
          {farm?.location && <button type="button" onClick={() => loadForecast(true)} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold transition hover:bg-green-50 disabled:opacity-60"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh forecast</button>}
        </header>

        {!farm?.location ? (
          <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5"><MapPin className="text-green-700" size={28} /><h2 className="mt-4 text-xl font-bold">Set your farm location</h2><p className="mt-2 text-sm text-black/55">Add a town, district, or postal code from your dashboard. We use it to look up the closest forecast location.</p><Link to="/dashboard" className="mt-5 inline-flex rounded-xl bg-[#092116] px-5 py-3 font-semibold text-white">Go to Dashboard</Link></section>
        ) : loading && !forecast ? (
          <section className="rounded-3xl bg-[#092116] p-8 text-white"><p className="text-sm text-white/65">Finding your farm location and loading the latest forecast…</p></section>
        ) : forecast ? (
          <>
            <section className="overflow-hidden rounded-3xl bg-[#092116] p-6 text-white shadow-xl sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div><div className="flex items-center gap-2 text-sm text-white/60"><MapPin size={16} />{forecast.location}</div><p className="mt-5 text-sm font-semibold text-lime-300">Current conditions</p><h2 className="mt-1 text-6xl font-semibold tracking-tight">{Math.round(forecast.current.temperature_2m)}<span className="text-3xl">{forecast.unit}</span></h2><p className="mt-2 text-lg text-white/85">{forecast.current.description}</p><p className="mt-2 text-sm text-white/55">Feels like {Math.round(forecast.current.apparent_temperature)}{forecast.unit} · Updated {new Date(forecast.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p></div>
                <div className="grid min-w-[230px] grid-cols-2 gap-3">
                  <WeatherMetric icon={<Droplets size={18} />} label="Humidity" value={`${forecast.current.relative_humidity_2m}%`} />
                  <WeatherMetric icon={<Wind size={18} />} label="Wind" value={`${Math.round(forecast.current.wind_speed_10m)} km/h`} />
                  <WeatherMetric icon={<CloudSun size={18} />} label="Rain now" value={`${forecast.current.precipitation} mm`} />
                  <WeatherMetric icon={<MapPin size={18} />} label="Today high / low" value={`${Math.round(forecast.daily[0]?.high ?? 0)}${forecast.unit} / ${Math.round(forecast.daily[0]?.low ?? 0)}${forecast.unit}`} />
                </div>
              </div>
            </section>

            <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-7">
              <div className="flex items-end justify-between gap-3"><div><p className="text-sm font-semibold text-green-700">Plan the week</p><h2 className="mt-1 text-2xl font-bold">7-day forecast</h2></div><p className="text-xs text-black/40">Local time · {forecast.timezone}</p></div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                {forecast.daily.map((day, index) => <article key={day.date} className="rounded-2xl bg-[#f5f8f3] p-4"><p className="text-xs font-semibold text-black/45">{index === 0 ? "Today" : new Date(`${day.date}T12:00:00`).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}</p><p className="mt-3 text-sm font-semibold">{day.description}</p><p className="mt-2 text-lg font-bold">{Math.round(day.high)}{forecast.unit} <span className="text-sm font-medium text-black/40">{Math.round(day.low)}{forecast.unit}</span></p><p className="mt-2 text-xs text-blue-800">Rain chance {day.precipitationProbability ?? 0}%</p><p className="mt-1 text-xs text-black/45">{day.precipitation ?? 0} mm expected</p></article>)}
              </div>
            </section>

            <section className="mt-6 rounded-3xl border border-lime-200 bg-white p-6 shadow-sm sm:p-7">
              <p className="text-sm font-semibold text-green-700">Regional soil guide</p><h2 className="mt-1 text-2xl font-bold">{forecast.soilGuide.soil}</h2><p className="mt-1 text-sm text-black/45">{forecast.soilGuide.region}</p><p className="mt-4 max-w-4xl text-sm leading-6 text-black/65">{forecast.soilGuide.detail}</p><div className="mt-4 rounded-2xl bg-lime-50 p-4"><p className="text-xs font-bold uppercase tracking-wider text-green-800">Commonly suited crops</p><p className="mt-1 text-sm text-black/70">{forecast.soilGuide.crops}</p></div><p className="mt-4 text-xs leading-5 text-black/45">This is broad regional guidance, not a field-level soil test or a claim that one soil is perfect. Soil can vary across a farm; test pH and nutrients before choosing crops or amendments. See <a className="underline" href="https://www.icar.gov.in/en/landmark-technologies-1" target="_blank" rel="noreferrer">ICAR soil resource maps</a> for more detailed regional information.</p>
            </section>
          </>
        ) : null}

        {forecastError && <div role="alert" className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><span>{forecastError}</span><button type="button" onClick={() => loadForecast(true)} className="font-semibold underline">Try again</button></div>}

        <section className="mt-8 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <form onSubmit={saveObservation} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <h2 className="text-xl font-bold">Save a field observation</h2><p className="mt-1 text-sm text-black/50">Record your own measurements; these can prefill the crop growth screen.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Temperature (°C)" name="temperature" value={form.temperature} onChange={(event) => setForm((current) => ({ ...current, temperature: event.target.value }))} /><Field label="Rainfall (mm)" name="rainfall" value={form.rainfall} onChange={(event) => setForm((current) => ({ ...current, rainfall: event.target.value }))} /><Field label="Humidity (%)" name="humidity" value={form.humidity} onChange={(event) => setForm((current) => ({ ...current, humidity: event.target.value }))} /><label className="text-sm font-medium">Condition<select value={form.condition} onChange={(event) => setForm((current) => ({ ...current, condition: event.target.value }))} className="mt-2 block w-full rounded-xl border border-black/10 bg-white px-3 py-3 outline-none focus:border-green-700">{["Clear", "Cloudy", "Partly cloudy", "Rain", "Windy", "Other"].map((item) => <option key={item}>{item}</option>)}</select></label></div>
            {formError && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{formError}</p>}<button className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#092116] px-5 py-3 font-semibold text-white hover:bg-green-900"><Plus size={17} /> Save observation</button>
          </form>
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5"><h2 className="text-xl font-bold">Recent field observations</h2>{latest ? <ul className="mt-3 divide-y divide-black/5">{observations.slice(0, 6).map((item) => <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-4 text-sm"><div><p className="font-semibold">{item.condition} · {item.temperature}°C</p><p className="mt-1 text-black/50">Rain {item.rainfall} mm · Humidity {item.humidity}%</p></div><time className="text-xs text-black/45">{new Date(item.recordedAt).toLocaleString()}</time></li>)}</ul> : <div className="mt-4 rounded-2xl bg-[#f5f8f3] p-5 text-sm text-black/55">No manual observations saved yet. You can use the forecast above or add measured field readings here.</div>}</section>
        </section>
        {forecast && <p className="mt-5 text-center text-xs text-black/40">Forecast provided by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="underline">Open-Meteo</a>. Weather values are model forecasts for the nearest grid location.</p>}
      </div>
    </main>
  );
}

function WeatherMetric({ icon, label, value }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4"><div className="flex items-center gap-2 text-lime-300">{icon}<span className="text-xs text-white/55">{label}</span></div><p className="mt-2 text-base font-semibold text-white">{value}</p></div>;
}

function Field({ label, name, value, onChange }) {
  return <label className="text-sm font-medium">{label}<input name={name} type="number" step="any" value={value} onChange={onChange} required className="mt-2 block w-full rounded-xl border border-black/10 px-3 py-3 outline-none focus:border-green-700" /></label>;
}

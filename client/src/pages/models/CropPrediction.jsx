import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, CloudSun, FlaskConical, Info, MapPin, RefreshCw, Sprout } from "lucide-react";
import { predictCrop } from "../../services/mlApi";
import { getFarmForecast } from "../../services/farmWeather";

const FIELD_GROUPS = [
  {
    title: "Soil nutrients",
    description: "Use a recent soil test for the most useful crop match.",
    icon: FlaskConical,
    fields: [
      { name: "N", label: "Nitrogen (N)", unit: "kg/ha", min: 0, max: 140, step: "any", placeholder: "For example, 90", hint: "Soil test value" },
      { name: "P", label: "Phosphorus (P)", unit: "kg/ha", min: 5, max: 145, step: "any", placeholder: "For example, 42", hint: "Soil test value" },
      { name: "K", label: "Potassium (K)", unit: "kg/ha", min: 5, max: 205, step: "any", placeholder: "For example, 43", hint: "Soil test value" },
      { name: "ph", label: "Soil pH", unit: "pH", min: 3.5, max: 9.94, step: "any", placeholder: "For example, 6.5", hint: "Use a lab or field-kit reading" },
    ],
  },
  {
    title: "Growing conditions",
    description: "Weather values can be prefilled from your farm forecast. Check they represent your growing season.",
    icon: CloudSun,
    fields: [
      { name: "temperature", label: "Temperature", unit: "°C", min: 8.83, max: 43.67, step: "any", placeholder: "For example, 24", hint: "Typical crop-season value" },
      { name: "humidity", label: "Relative humidity", unit: "%", min: 14.26, max: 99.98, step: "any", placeholder: "For example, 70", hint: "Typical crop-season value" },
      { name: "rainfall", label: "Rainfall", unit: "mm", min: 20.22, max: 298.56, step: "any", placeholder: "For example, 110", hint: "Seasonal or crop-period rainfall" },
    ],
  },
];

const TRAINING_RANGES = {
  N: [0, 140], P: [5, 145], K: [5, 205], ph: [3.51, 9.93],
  temperature: [8.83, 43.67], humidity: [14.26, 99.98], rainfall: [20.22, 298.56],
};

function getObservationDefaults() {
  try {
    const observations = JSON.parse(localStorage.getItem("khetwise_weather_observations") || "[]");
    const latest = Array.isArray(observations) ? observations[0] : null;
    if (!latest) return {};
    const temperature = Number(latest.temperature);
    const humidity = Number(latest.humidity);
    return {
      ...(Number.isFinite(temperature) ? { temperature: String(temperature) } : {}),
      ...(Number.isFinite(humidity) ? { humidity: String(humidity) } : {}),
      ...(Number.isFinite(temperature) || Number.isFinite(humidity) ? { source: "your latest field observation" } : {}),
    };
  } catch {
    return {};
  }
}

export default function CropPrediction() {
  const [formData, setFormData] = useState({ N: "", P: "", K: "", temperature: "", humidity: "", ph: "", rainfall: "" });
  const [weatherMessage, setWeatherMessage] = useState("Checking farm weather for optional prefill…");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const saved = getObservationDefaults();
    if (Object.keys(saved).length) {
      setFormData((current) => ({ ...current, temperature: saved.temperature || current.temperature, humidity: saved.humidity || current.humidity }));
      setWeatherMessage("Temperature and humidity prefilled from your latest field observation. Review for your crop season.");
    }

    let location = "";
    try { location = JSON.parse(localStorage.getItem("khetwise_farm") || "null")?.location || ""; } catch { /* farm details can be added from the dashboard */ }
    if (!location) {
      if (!saved.source) setWeatherMessage("Add a farm location on the dashboard to prefill local weather.");
      return () => { active = false; };
    }

    getFarmForecast(location)
      .then((forecast) => {
        if (!active) return;
        const rawTemperature = Number(forecast.current.temperature_2m);
        const temperatureCelsius = forecast.unit === "°F" ? (rawTemperature - 32) * 5 / 9 : rawTemperature;
        setFormData((current) => ({
          ...current,
          temperature: current.temperature || String(Math.round(temperatureCelsius * 10) / 10),
          humidity: current.humidity || String(forecast.current.relative_humidity_2m),
        }));
        setWeatherMessage(saved.source
          ? `Your latest field observation is available; farm forecast checked for ${forecast.location}. Use conditions representative of the crop season.`
          : `Weather prefill from ${forecast.location}. Use representative crop-season conditions; today's forecast may differ.`);
      })
      .catch(() => {
        if (active && !saved.source) setWeatherMessage("Farm forecast unavailable. Enter representative crop-season conditions manually.");
      });

    return () => { active = false; };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = {};
      for (const [name, [minimum, maximum]] of Object.entries(TRAINING_RANGES)) {
        const value = Number(formData[name]);
        if (formData[name] === "" || !Number.isFinite(value)) throw new Error(`Enter a valid ${name === "ph" ? "soil pH" : name} value.`);
        if (value < minimum || value > maximum) throw new Error(`${name === "ph" ? "Soil pH" : name} should be between ${minimum} and ${maximum}, the range represented in this model’s training data.`);
        payload[name] = value;
      }
      const response = await predictCrop(payload);
      if (!response?.success || !response.recommended_crop) throw new Error("The model did not return a crop recommendation. Please review your values and try again.");
      setResult(response);
    } catch (requestError) {
      setError(requestError.message || "Crop recommendation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const recommendations = [...(result?.recommendations || [])].sort((a, b) => b.score - a.score).slice(0, 3);

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_rgba(190,242,100,0.16),_transparent_34%),linear-gradient(135deg,_#f8faf6_0%,_#f2f6ef_100%)] px-4 py-7 text-[#102018] sm:px-7 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <Link to="/dashboard" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-green-800 transition hover:text-green-950"><ArrowLeft size={17} /> Dashboard</Link>

        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-green-800/10 bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-green-800"><Sprout size={14} /> KhetWise crop intelligence</p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Find a crop suited to your conditions</h1>
            <p className="mt-3 max-w-2xl leading-7 text-[#647168]">Use soil-test nutrients and representative growing-season weather for a more useful model recommendation.</p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-xl border border-black/[0.06] bg-white/80 px-3.5 py-2.5 text-sm font-medium text-[#536157] shadow-sm sm:self-auto"><MapPin size={16} className="text-green-700" /> {readFarmLocation()}</div>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(290px,0.8fr)]">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-black/[0.06] bg-white p-5 shadow-[0_12px_35px_rgba(16,32,24,0.055)] sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div><h2 className="text-xl font-bold">Farm conditions</h2><p className="mt-1 text-sm text-black/50">All values are required by the trained model.</p></div>
              <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-bold text-green-800">7 inputs</span>
            </div>

            {FIELD_GROUPS.map((group) => {
              const Icon = group.icon;
              return <section key={group.title} className="mb-7 last:mb-0">
                <div className="mb-4 flex items-start gap-3 border-b border-black/[0.06] pb-3"><div className="mt-0.5 rounded-lg bg-lime-100 p-2 text-green-800"><Icon size={17} /></div><div><h3 className="font-bold">{group.title}</h3><p className="mt-0.5 text-xs leading-5 text-black/45">{group.description}</p></div></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {group.fields.map((field) => <div key={field.name}>
                    <label htmlFor={`crop-${field.name}`} className="flex items-center justify-between gap-2 text-sm font-semibold text-[#25372b]"><span>{field.label}</span><span className="text-xs font-medium text-black/40">{field.unit}</span></label>
                    <input id={`crop-${field.name}`} type="number" step={field.step} min={field.min} max={field.max} name={field.name} value={formData[field.name]} onChange={handleChange} placeholder={field.placeholder} required className="mt-2 w-full rounded-xl border border-black/10 bg-[#fbfcfa] px-4 py-3 text-[#102018] outline-none transition placeholder:text-black/30 hover:border-black/20 focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-700/10" />
                    <p className="mt-1.5 text-xs text-black/40">{field.hint} · Model range {field.min}–{field.max}</p>
                  </div>)}
                </div>
              </section>;
            })}

            <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50/70 p-4"><p className="flex items-start gap-2 text-xs leading-5 text-blue-950"><Info size={16} className="mt-0.5 shrink-0" />{weatherMessage}</p></div>
            {error && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
            <button type="submit" disabled={loading} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#092116] px-6 py-3.5 font-bold text-white shadow-lg shadow-green-950/10 transition hover:bg-green-900 disabled:cursor-wait disabled:opacity-60">{loading ? <><RefreshCw size={17} className="animate-spin" /> Analysing conditions…</> : <>Get crop recommendation <ArrowRight size={17} /></>}</button>
            <p className="mt-3 text-center text-xs text-black/40">Predictions are model estimates. Confirm crop choice with local agronomy advice.</p>
          </form>

          <aside className="space-y-5 lg:sticky lg:top-6">
            {result ? <section aria-live="polite" className="overflow-hidden rounded-3xl border border-lime-200 bg-white shadow-[0_18px_45px_rgba(16,32,24,0.08)]">
              <div className="bg-[linear-gradient(130deg,#092116,#16472a)] p-6 text-white sm:p-7"><p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-lime-300"><Check size={15} /> Top model match</p><h2 className="mt-3 text-3xl font-extrabold capitalize">{result.recommended_crop}</h2><p className="mt-2 text-sm leading-6 text-white/60">Selected from the soil and climate values you provided.</p></div>
              <div className="p-6 sm:p-7"><h3 className="font-bold">Model match scores</h3><div className="mt-4 space-y-4">{recommendations.map((item, index) => <div key={item.crop}><div className="mb-2 flex items-center justify-between gap-3"><span className="font-semibold capitalize">{item.crop}{index === 0 && <span className="ml-2 rounded-full bg-lime-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-800">Top match</span>}</span><span className="text-sm font-bold text-green-800">{Math.round(item.score * 100)}%</span></div><div className="h-2 overflow-hidden rounded-full bg-green-50"><div className={`h-full rounded-full ${index === 0 ? "bg-green-700" : "bg-lime-500"}`} style={{ width: `${Math.max(0, Math.min(100, item.score * 100))}%` }} /></div></div>)}</div><p className="mt-5 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-950">Scores show the model’s relative estimates among its crop classes; they are not a guaranteed chance of success.</p></div>
            </section> : <section className="rounded-3xl border border-black/[0.06] bg-white/85 p-6 shadow-sm sm:p-7"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-100 text-green-800"><Sprout size={23} /></div><h2 className="mt-5 text-xl font-bold">Your recommendation will appear here</h2><p className="mt-2 text-sm leading-6 text-black/50">Enter soil-test results and typical crop-season weather. KhetWise will rank the closest matches from the model.</p><div className="mt-5 space-y-3 border-t border-black/[0.06] pt-5 text-sm text-black/60"><p className="flex items-center gap-2"><Check size={16} className="text-green-700" /> Use tested N, P, K and pH</p><p className="flex items-center gap-2"><Check size={16} className="text-green-700" /> Prefer seasonal weather averages</p><p className="flex items-center gap-2"><Check size={16} className="text-green-700" /> Compare results with local guidance</p></div></section>}
            <section className="rounded-2xl border border-black/[0.06] bg-white/65 p-5"><h3 className="text-sm font-bold">Why are soil readings needed?</h3><p className="mt-2 text-xs leading-5 text-black/50">The recommendation model was trained on nitrogen, phosphorus, potassium, temperature, humidity, pH and rainfall. Removing these inputs would make the prediction less representative of the model.</p></section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function readFarmLocation() {
  try { return JSON.parse(localStorage.getItem("khetwise_farm") || "null")?.location || "Farm location not set"; }
  catch { return "Farm location not set"; }
}

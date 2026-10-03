import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Settings as SettingsIcon } from "lucide-react";

const DEFAULTS = { weatherAlerts: true, cropAlerts: true, marketAlerts: false, temperatureUnit: "C" };

function readSettings() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem("khetwise_settings") || "{}") };
  } catch {
    return DEFAULTS;
  }
}

export default function Settings() {
  const [settings, setSettings] = useState(readSettings);
  const [saved, setSaved] = useState(false);

  const update = (name, value) => {
    const next = { ...settings, [name]: value };
    setSettings(next);
    localStorage.setItem("khetwise_settings", JSON.stringify(next));
    setSaved(true);
  };

  return (
    <main className="min-h-screen bg-[#f5f8f3] px-5 py-8 text-[#102018] sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/dashboard" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-green-800 hover:text-green-950"><ArrowLeft size={17} /> Back to Dashboard</Link>
        <header className="mb-8"><p className="text-sm font-semibold text-green-700">Account</p><h1 className="mt-1 text-3xl font-bold">Settings</h1><p className="mt-2 text-black/55">Choose the alerts and display units you prefer.</p></header>
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-black/5 pb-5"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-100 text-green-800"><SettingsIcon size={23} /></div><div><h2 className="font-bold">Preferences</h2><p className="text-sm text-black/50">Saved automatically in this browser.</p></div></div>
          <div className="divide-y divide-black/5">
            <Preference title="Weather alerts" description="Show reminders for changing weather conditions." checked={settings.weatherAlerts} onChange={(value) => update("weatherAlerts", value)} />
            <Preference title="Crop care alerts" description="Keep crop and field care reminders enabled." checked={settings.cropAlerts} onChange={(value) => update("cropAlerts", value)} />
            <Preference title="Market alerts" description="Enable reminders when checking market prices." checked={settings.marketAlerts} onChange={(value) => update("marketAlerts", value)} />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-black/5 pt-5"><div><p className="font-semibold">Temperature unit</p><p className="mt-1 text-sm text-black/50">Used for weather information.</p></div><select aria-label="Temperature unit" value={settings.temperatureUnit} onChange={(event) => update("temperatureUnit", event.target.value)} className="rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-green-700"><option value="C">Celsius (°C)</option><option value="F">Fahrenheit (°F)</option></select></div>
          {saved && <p role="status" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-green-800"><Check size={17} /> Preferences saved</p>}
        </section>
      </div>
    </main>
  );
}

function Preference({ title, description, checked, onChange }) {
  return <label className="flex cursor-pointer items-center justify-between gap-4 py-5"><span><span className="block font-semibold">{title}</span><span className="mt-1 block text-sm text-black/50">{description}</span></span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 shrink-0 accent-green-800" /></label>;
}

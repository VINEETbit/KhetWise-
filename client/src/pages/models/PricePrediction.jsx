import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, IndianRupee, TrendingUp } from "lucide-react";
import { predictPrice } from "../../services/mlApi";

const COMMODITIES = ["Barley (Jau)", "Coconut", "Coffee", "Cotton", "Ginger(Dry)", "Groundnut", "Jowar(Sorghum)", "Maize", "Millets", "Rice", "Sugar", "Sugarcane", "Sunflower", "Tea", "Turmeric", "Wheat"];

export default function PricePrediction() {
  const [formData, setFormData] = useState({ commodity_name: "", avg_min_price: "", avg_max_price: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const minimum = Number(formData.avg_min_price);
    const maximum = Number(formData.avg_max_price);
    if (minimum > maximum) {
      setError("Minimum price must be lower than or equal to maximum price.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      setResult(await predictPrice({ commodity_name: formData.commodity_name, avg_min_price: minimum, avg_max_price: maximum }));
    } catch (err) {
      setError(err.message || "Price estimate failed. Check that the ML service is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f8f3] px-5 py-8 text-[#102018] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link to="/dashboard" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-green-800 hover:text-green-950"><ArrowLeft size={17} /> Back to Dashboard</Link>
        <header className="mb-7"><p className="text-sm font-semibold text-green-700">KhetWise AI</p><h1 className="mt-1 text-3xl font-bold sm:text-4xl">Market Price Estimate</h1><p className="mt-2 max-w-2xl text-black/55">Estimate a commodity’s modal price from its current market range. Only three inputs are needed.</p></header>
        <section className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
            <h2 className="text-xl font-bold">Market details</h2>
            <label className="mt-5 block text-sm font-semibold">Commodity<select name="commodity_name" value={formData.commodity_name} onChange={handleChange} required className="mt-2 block w-full rounded-xl border border-black/10 bg-white px-4 py-3 font-normal outline-none focus:border-green-700"><option value="">Choose commodity</option>{COMMODITIES.map((commodity) => <option key={commodity}>{commodity}</option>)}</select></label>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <PriceInput label="Minimum price (₹/quintal)" name="avg_min_price" value={formData.avg_min_price} onChange={handleChange} />
              <PriceInput label="Maximum price (₹/quintal)" name="avg_max_price" value={formData.avg_max_price} onChange={handleChange} />
            </div>
            {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button type="submit" disabled={loading} className="mt-6 w-full rounded-xl bg-[#092116] px-6 py-3.5 font-semibold text-white hover:bg-green-900 disabled:cursor-wait disabled:opacity-60">{loading ? "Estimating…" : "Estimate modal price"}</button>
          </form>
          <aside className="rounded-3xl bg-[#092116] p-6 text-white sm:p-8"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-300 text-green-950"><TrendingUp size={21} /></div><h2 className="mt-5 text-xl font-bold">What this estimate means</h2><p className="mt-3 text-sm leading-6 text-white/70">The model estimates a modal price from the commodity and market min/max prices. It does not forecast future market prices. Values should reflect the same market and date.</p></aside>
        </section>
        {result && <section className="mt-7 rounded-3xl border border-green-200 bg-white p-6 shadow-sm sm:p-8"><div className="flex items-center gap-3 text-green-800"><div className="rounded-xl bg-lime-100 p-2"><IndianRupee size={20} /></div><p className="text-sm font-bold uppercase tracking-wider">Estimated modal price</p></div><p className="mt-3 text-4xl font-bold">₹{Number(result.predicted_price).toLocaleString("en-IN", { maximumFractionDigits: 2 })}<span className="ml-2 text-base font-medium text-black/45">/ quintal</span></p><p className="mt-2 text-sm text-black/50">Estimate for {formData.commodity_name}. This is a model estimate, not a guaranteed market rate.</p></section>}
      </div>
    </main>
  );
}

function PriceInput({ label, name, value, onChange }) {
  return <label className="text-sm font-semibold">{label}<input name={name} type="number" min="0" step="any" value={value} onChange={onChange} placeholder="Enter market price" required className="mt-2 block w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-green-700" /></label>;
}

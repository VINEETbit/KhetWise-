import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BadgeCheck, FlaskConical, Leaf, TriangleAlert } from "lucide-react";
import { predictFertilizer, predictYield, predictDisease, predictGrowth } from "../../services/mlApi";

const MODEL_CONFIG = {
  fertilizer: {
    title: "Fertilizer Recommendation",
    intro: "Use soil nutrient readings and crop stage to compare suitable fertilizer options.",
    submitLabel: "Get fertilizer recommendation",
    predict: predictFertilizer,
    fields: [
      ["Nitrogen_Level", "Nitrogen (N) level", "number", "Enter soil-test value"],
      ["Phosphorus_Level", "Phosphorus (P) level", "number", "Enter soil-test value"],
      ["Potassium_Level", "Potassium (K) level", "number", "Enter soil-test value"],
      ["Soil_pH", "Soil pH", "number", "For example, 6.5"],
      ["Crop_Growth_Stage", "Crop growth stage", "select", ["Sowing", "Vegetative", "Flowering", "Harvest"]],
    ],
    note: "For best results, use current soil-test readings. Recommendation quality depends on the quality and representativeness of the training data.",
  },
  yield: {
    title: "Yield per Area",
    intro: "Calculate the yield represented by your production and cultivated-area figures.",
    submitLabel: "Calculate yield per area",
    predict: predictYield,
    fields: [
      ["Production", "Production (as recorded for this crop)", "number", "Enter total production"],
      ["Area", "Cultivated area (hectares)", "number", "Enter cultivated area"],
    ],
    note: "This calculation uses production ÷ area. Crop production units vary in the source data, so compare results only for the same crop and unit convention.",
  },
  disease: {
    title: "Plant Symptom Screen",
    intro: "Answer six questions about visible symptoms and field conditions.",
    submitLabel: "Screen symptoms",
    predict: predictDisease,
    fields: [
      ["Is there any other crop in the field showing similar spots?", "Are other crops showing similar spots?", "boolean"],
      ["Are pruning and sanitation practices followed?", "Are pruning and sanitation practices followed?", "boolean"],
      ["Was the field irrigated from overhead sprinklers?", "Was overhead sprinkler irrigation used?", "boolean"],
      ["Was there poor air circulation in the field?", "Was air circulation poor?", "boolean"],
      ["Was any fungicide recently applied?", "Was fungicide recently applied?", "boolean"],
      ["Is the farmer using resistant tomato varieties?", "Are resistant tomato varieties being used?", "boolean"],
    ],
    note: "Prototype symptom screen trained on a small synthetic dataset. It is not a diagnosis and may miss diseases. Ask an agricultural expert to confirm symptoms.",
  },
  growth: {
    title: "Crop Growth Conditions",
    intro: "Combine crop stage, soil, moisture, and field weather to classify the dataset growth category.",
    submitLabel: "Check growth conditions",
    predict: predictGrowth,
    fields: [
      ["crop ID", "Crop", "select", ["Carrot", "Chilli", "Potato", "Tomato", "Wheat"]],
      ["soil_type", "Soil type", "select", ["Alluvial Soil", "Black Soil", "Chalky Soil", "Clay Soil", "Loam Soil", "Red Soil", "Sandy Soil"]],
      ["Seedling Stage", "Crop stage", "select", ["Flowering", "Fruit/Grain/Bulb Formation", "Germination", "Harvest", "Maturation", "Pollination", "Seedling Stage", "Vegetative Growth / Root or Tuber Development"]],
      ["MOI", "Moisture index (MOI)", "number", "Enter measured value"],
      ["temp", "Temperature (°C)", "number", "Enter field reading"],
      ["humidity", "Humidity (%)", "number", "Enter field reading"],
    ],
    note: "Growth categories are dataset labels (0, 1, and 2); the source data does not define what each category means. Use this as a screening result, not an agronomic diagnosis.",
  },
};

function getInitialValues(config, model) {
  const values = Object.fromEntries(config.fields.map(([name]) => [name, ""]));
  if (model === "growth") {
    try {
      const observations = JSON.parse(localStorage.getItem("khetwise_weather_observations") || "[]");
      const latest = Array.isArray(observations) ? observations[0] : null;
      if (latest) {
        const temperature = Number.parseFloat(latest.temperature);
        const humidity = Number.parseFloat(latest.humidity);
        values.temp = Number.isFinite(temperature) ? String(temperature) : "";
        values.humidity = Number.isFinite(humidity) ? String(humidity) : "";
      }
      if (!values.temp || !values.humidity) {
        const cache = JSON.parse(localStorage.getItem("khetwise_forecast_cache") || "null");
        const current = cache?.data?.current;
        const temperature = Number(current?.temperature_2m);
        const humidity = Number(current?.relative_humidity_2m);
        if (!values.temp && Number.isFinite(temperature)) {
          values.temp = String(cache?.data?.unit === "°F" ? (temperature - 32) * 5 / 9 : temperature);
        }
        if (!values.humidity && Number.isFinite(humidity)) values.humidity = String(humidity);
      }
    } catch {
      // The user can enter weather values manually if no valid reading is saved.
    }
  }
  return values;
}

export default function ModelPrediction({ model }) {
  const config = MODEL_CONFIG[model];
  const [formData, setFormData] = useState(() => getInitialValues(config, model));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const payload = {};
      config.fields.forEach(([name, , type]) => {
        const value = formData[name];
        if (type === "number") {
          const numericValue = Number(value);
          if (!value || !Number.isFinite(numericValue)) {
            throw new Error(`Enter a valid number for ${name}.`);
          }
          payload[name] = numericValue;
        } else {
          payload[name] = type === "boolean" ? (value === "true" ? "Yes" : "No") : value;
        }
      });
      setResult(await config.predict(payload));
    } catch (err) {
      setError(err.message || `${config.title} failed. Check the ML service and try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f8f3] px-5 py-8 text-[#102018] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link to="/dashboard" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-green-800 hover:text-green-950"><ArrowLeft size={17} /> Back to Dashboard</Link>
        <header className="mb-7"><p className="text-sm font-semibold text-green-700">KhetWise AI</p><h1 className="mt-1 text-3xl font-bold sm:text-4xl">{config.title}</h1><p className="mt-2 max-w-2xl text-black/55">{config.intro}</p></header>

        <section className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
          <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
            <div className="mb-6 flex items-center gap-3 border-b border-black/5 pb-5"><div className="rounded-xl bg-lime-100 p-3 text-green-800"><FlaskConical size={21} /></div><div><h2 className="font-bold">Enter model inputs</h2><p className="text-sm text-black/50">{config.fields.length} details required</p></div></div>
            <div className="grid gap-5 sm:grid-cols-2">
              {config.fields.map(([name, label, type, extra]) => <Field key={name} name={name} label={label} type={type} extra={extra} value={formData[name]} onChange={handleChange} />)}
            </div>
            {model === "growth" && formData.temp !== "" && formData.humidity !== "" && <p className="mt-4 text-xs text-green-800">Temperature and humidity were prefilled from your latest saved weather observation or farm forecast. You can edit them.</p>}
            {error && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
            <button type="submit" disabled={loading} className="mt-6 w-full rounded-xl bg-[#092116] px-6 py-3.5 font-semibold text-white transition hover:bg-green-900 disabled:cursor-wait disabled:opacity-60">{loading ? "Working…" : config.submitLabel}</button>
          </form>

          <aside className="rounded-3xl bg-[#092116] p-6 text-white sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-300 text-green-950"><Leaf size={21} /></div>
            <h2 className="mt-5 text-xl font-bold">Before you start</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">Use measurements from the same field and crop cycle. Unsupported category values are rejected instead of silently producing a potentially misleading result.</p>
            <p className="mt-5 border-t border-white/10 pt-5 text-xs leading-5 text-white/55">{config.note}</p>
          </aside>
        </section>

        {result && <ResultCard model={model} result={result} />}
      </div>
    </main>
  );
}

function Field({ name, label, type, extra, value, onChange }) {
  if (type === "select" || type === "boolean") {
    const options = type === "boolean" ? [["true", "Yes"], ["false", "No"]] : extra.map((option) => [option, option]);
    return <label className="text-sm font-semibold">{label}<select name={name} value={value} onChange={onChange} required className="mt-2 block w-full rounded-xl border border-black/10 bg-white px-4 py-3 font-normal outline-none focus:border-green-700"><option value="">Choose an option</option>{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label>;
  }
  return <label className="text-sm font-semibold">{label}<input name={name} type="number" min={name === "Area" || name === "Production" || name === "MOI" ? "0" : undefined} step="any" value={value} onChange={onChange} placeholder={extra} required className="mt-2 block w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-green-700" /></label>;
}

function ResultCard({ model, result }) {
  if (model === "fertilizer") return <section className="mt-7 rounded-3xl border border-green-200 bg-white p-6 shadow-sm sm:p-8"><div className="flex items-center gap-3 text-green-800"><BadgeCheck size={22} /><p className="text-sm font-bold uppercase tracking-wider">Recommendation</p></div><h2 className="mt-3 text-3xl font-bold">{result.recommended_fertilizer}</h2><p className="mt-2 text-sm text-black/50">Predicted from soil NPK, pH, and crop growth stage.</p>{result.recommendations?.length > 1 && <div className="mt-6 grid gap-3 sm:grid-cols-3">{result.recommendations.map((item) => <div key={item.fertilizer} className="rounded-2xl bg-[#f5f8f3] p-4"><p className="font-semibold">{item.fertilizer}</p><p className="mt-1 text-sm text-black/50">Model score {Math.round(item.score * 100)}%</p></div>)}</div>}</section>;
  if (model === "yield") return <section className="mt-7 rounded-3xl border border-green-200 bg-white p-6 shadow-sm sm:p-8"><p className="text-sm font-bold uppercase tracking-wider text-green-800">Calculated yield per hectare</p><p className="mt-3 text-4xl font-bold">{Number(result.estimated_yield).toLocaleString(undefined, { maximumFractionDigits: 3 })}</p><p className="mt-2 text-sm text-black/50">{result.unit}</p><p className="mt-4 rounded-xl bg-[#f5f8f3] p-4 text-sm text-black/60">Calculated as {result.method}. The source data uses different production units across crops.</p></section>;
  if (model === "disease") return <section className="mt-7 rounded-3xl border border-amber-200 bg-white p-6 shadow-sm sm:p-8"><div className="flex items-center gap-3 text-amber-800"><TriangleAlert size={22} /><p className="text-sm font-bold uppercase tracking-wider">Symptom screen</p></div><h2 className="mt-3 text-3xl font-bold">{result.disease_present === "Present" ? "Possible symptoms detected" : "No matching symptoms detected"}</h2><p className="mt-3 text-sm text-black/55">Model score {Math.round((result.model_score || 0) * 100)}% · {result.notice}</p></section>;
  return <section className="mt-7 rounded-3xl border border-green-200 bg-white p-6 shadow-sm sm:p-8"><p className="text-sm font-bold uppercase tracking-wider text-green-800">Growth screening result</p><h2 className="mt-3 text-3xl font-bold">{result.growth_category}</h2><p className="mt-2 text-sm text-black/55">Model score {Math.round((result.model_score || 0) * 100)}%. This category is not clinically or agronomically interpreted in the source data.</p></section>;
}

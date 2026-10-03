const FORECAST_CACHE_KEY = "khetwise_forecast_cache";
const CACHE_DURATION_MS = 10 * 60 * 1000;

const SOIL_GUIDES = [
  { matches: ["punjab", "haryana", "uttar pradesh", "bihar", "west bengal"], soil: "Alluvial soils", detail: "Typically deep and productive in the plains. Drainage, pH, and nutrient levels still vary by field.", crops: "Rice, wheat, sugarcane, pulses, and vegetables" },
  { matches: ["maharashtra", "madhya pradesh", "gujarat", "telangana"], soil: "Black (regur) soils are common in parts of the region", detail: "Clay-rich soils can hold water and shrink as they dry. Field drainage and soil testing matter.", crops: "Cotton, soybean, sorghum, pulses, and sugarcane" },
  { matches: ["rajasthan"], soil: "Arid and sandy soils are common", detail: "Low and variable rainfall makes water conservation and organic matter especially important.", crops: "Pearl millet, pulses, guar, and drought-tolerant crops" },
  { matches: ["odisha", "chhattisgarh", "jharkhand", "tamil nadu"], soil: "Red and yellow soils are common in many areas", detail: "These soils can be relatively low in nutrients; local pH and nutrient tests guide amendments.", crops: "Millets, pulses, groundnut, and regionally adapted rice" },
  { matches: ["kerala", "goa", "meghalaya", "mizoram", "nagaland", "manipur", "tripura", "arunachal pradesh", "sikkim"], soil: "Lateritic or acidic hill soils occur in many areas", detail: "Soil properties change sharply with elevation and landform. Check pH and erosion risk before amendments.", crops: "Tea, spices, cashew, rice, and locally adapted horticulture" },
  { matches: ["himachal pradesh", "uttarakhand", "jammu", "kashmir", "ladakh"], soil: "Mountain and valley soils vary by slope and elevation", detail: "Drainage, soil depth, and erosion control are key; a state-level soil label is not precise enough for a field prescription.", crops: "Temperate fruits, pulses, maize, and locally adapted terrace crops" },
  { matches: ["assam"], soil: "Alluvial soils in river plains; acidic hill soils in uplands", detail: "The right soil description depends on whether the farm is in the valley or hills.", crops: "Rice, tea, pulses, and locally adapted horticulture" },
  { matches: ["karnataka", "andhra pradesh"], soil: "Red soils and black soils both occur across the state", detail: "Soil type can differ between nearby districts; use a soil test for field-level decisions.", crops: "Millets, pulses, groundnut, cotton, and regionally adapted crops" },
];

function readTemperatureUnit() {
  try {
    return JSON.parse(localStorage.getItem("khetwise_settings") || "{}").temperatureUnit === "F" ? "fahrenheit" : "celsius";
  } catch {
    return "celsius";
  }
}

async function requestJson(url, signal) {
  const response = await fetch(url, { signal });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.error) throw new Error(data.reason || `Weather service returned ${response.status}.`);
  return data;
}

async function geocodeFarm(location, signal) {
  const search = async (countryCode) => {
    const params = new URLSearchParams({ name: location, count: "1", language: "en" });
    if (countryCode) params.set("countryCode", countryCode);
    const data = await requestJson(`https://geocoding-api.open-meteo.com/v1/search?${params}`, signal);
    return data.results?.[0];
  };

  return (await search("IN")) || (await search(""));
}

function makeSoilGuide(place) {
  const region = `${place.admin1 || ""} ${place.admin2 || ""}`.toLowerCase();
  const guide = SOIL_GUIDES.find((item) => item.matches.some((name) => region.includes(name)));
  if (!guide) {
    return {
      soil: "Field soil testing recommended",
      detail: "We could not match this location to a regional soil guide. A soil test is needed before choosing amendments or crops.",
      crops: "Use local agricultural extension guidance for crop selection.",
      region: [place.admin2, place.admin1, place.country].filter(Boolean).join(", "),
    };
  }
  return { ...guide, region: [place.admin2, place.admin1, place.country].filter(Boolean).join(", ") };
}

export function describeWeatherCode(code) {
  if (code === 0) return "Clear sky";
  if (code === 1) return "Mainly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain showers";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Weather conditions";
}

function cacheMatches(cache, location, unit) {
  return cache?.location?.toLowerCase() === location.toLowerCase() && cache?.unit === unit && Date.now() - cache.savedAt < CACHE_DURATION_MS;
}

export async function getFarmForecast(location, { signal, forceRefresh = false } = {}) {
  if (!location?.trim()) throw new Error("Add a farm location to see its forecast.");
  const unit = readTemperatureUnit();
  try {
    const cached = JSON.parse(localStorage.getItem(FORECAST_CACHE_KEY) || "null");
    if (!forceRefresh && cacheMatches(cached, location.trim(), unit)) return cached.data;
  } catch {
    // Ignore invalid cache and fetch a fresh forecast.
  }

  const place = await geocodeFarm(location.trim(), signal);
  if (!place) throw new Error("We couldn’t find that farm location. Add a nearby town or district to the farm address.");
  const params = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum",
    forecast_days: "7",
    timezone: "auto",
    temperature_unit: unit,
    wind_speed_unit: "kmh",
    precipitation_unit: "mm",
  });
  const forecast = await requestJson(`https://api.open-meteo.com/v1/forecast?${params}`, signal);
  if (!forecast.current || !forecast.daily) throw new Error("Weather data is not available for this location right now.");

  const data = {
    location: [place.name, place.admin1, place.country].filter(Boolean).join(", "),
    admin1: place.admin1 || "",
    latitude: place.latitude,
    longitude: place.longitude,
    timezone: forecast.timezone || place.timezone,
    unit: unit === "fahrenheit" ? "°F" : "°C",
    current: { ...forecast.current, description: describeWeatherCode(forecast.current.weather_code) },
    daily: forecast.daily.time.map((date, index) => ({
      date,
      code: forecast.daily.weather_code[index],
      description: describeWeatherCode(forecast.daily.weather_code[index]),
      high: forecast.daily.temperature_2m_max[index],
      low: forecast.daily.temperature_2m_min[index],
      precipitationProbability: forecast.daily.precipitation_probability_max[index],
      precipitation: forecast.daily.precipitation_sum[index],
    })),
    updatedAt: new Date().toISOString(),
    soilGuide: makeSoilGuide(place),
  };
  localStorage.setItem(FORECAST_CACHE_KEY, JSON.stringify({ location: location.trim(), unit, savedAt: Date.now(), data }));
  return data;
}

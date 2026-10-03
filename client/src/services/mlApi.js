const API_BASE_URL = "http://127.0.0.1:8000";

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(text || `Server returned HTTP ${response.status}`);
  }

  if (!response.ok) {
    const detail = data.detail || data.message;
    throw new Error(
      typeof detail === "string"
        ? detail
        : detail?.message || JSON.stringify(detail) || "API request failed",
    );
  }

  return data;
}

/* =========================
   CROP
========================= */

export async function predictCrop(data) {
  return apiRequest("/predict/crop", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* =========================
   FERTILIZER
========================= */

export async function predictFertilizer(data) {
  return apiRequest("/predict/fertilizer", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* =========================
   YIELD
========================= */

export async function predictYield(data) {
  return apiRequest("/predict/yield", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* =========================
   PRICE
========================= */

export async function predictPrice(data) {
  return apiRequest("/predict/price", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* =========================
   DISEASE
========================= */

export async function predictDisease(data) {
  return apiRequest("/predict/disease", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* =========================
   GROWTH
========================= */

export async function predictGrowth(data) {
  return apiRequest("/predict/growth", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

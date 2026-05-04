const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5050";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Something went wrong.");
  }

  return response.json();
}

export function generateItinerary(payload) {
  return request("/generate-itinerary", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function modifyItinerary(payload) {
  return request("/modify-itinerary", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function saveItinerary(payload) {
  return request("/save-itinerary", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function apiRequest(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.error || error.message || `Request failed: ${res.status}`,
    );
  }

  return res.json();
}

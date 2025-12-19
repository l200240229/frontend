const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL belum diset");
}

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // ❗ HANYA SET JSON HEADER JIKA BUKAN DELETE
  if (options.method !== "DELETE") {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 🔴 TOKEN EXPIRED
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    throw new Error("Session expired. Silakan login ulang.");
  }

  // ❌ ERROR LAIN
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;

    try {
        const data = await response.json();
        console.error("API ERROR RESPONSE:", data);

        if (typeof data === "object") {
        errorMessage = Object.entries(data)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
            .join(" | ");
        }
    } catch (e) {
        console.error("Failed to parse error JSON");
    }

    throw new Error(errorMessage);
    }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
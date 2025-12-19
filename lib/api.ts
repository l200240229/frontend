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

  // Jangan set JSON header kalau FormData
  if (
    options.body &&
    !(options.body instanceof FormData)
  ) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}/api${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  // Token expired
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
    throw new Error("Session expired");
  }

  if (!response.ok) {
    let message = `HTTP ${response.status}`;

    try {
      const data = await response.json();
      if (typeof data === "object") {
        message = Object.entries(data)
          .map(
            ([k, v]) =>
              `${k}: ${
                Array.isArray(v) ? v.join(", ") : v
              }`
          )
          .join(" | ");
      }
    } catch {}

    throw new Error(message);
  }

  if (response.status === 204) return null;

  return response.json();
}
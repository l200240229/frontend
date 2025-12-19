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

  // Jangan set Content-Type kalau FormData
  if (!(options.body instanceof FormData)) {
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

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
    throw new Error("Session expired");
  }

  if (!response.ok) {
    let msg = `HTTP ${response.status}`;
    try {
      const data = await response.json();
      msg = JSON.stringify(data);
    } catch {}
    throw new Error(msg);
  }

  return response.status === 204 ? null : response.json();
}
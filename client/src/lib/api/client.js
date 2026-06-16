export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";

export function getApiUrl(path = "") {
  let baseUrl = API_BASE_URL;
  if (typeof window !== "undefined" && baseUrl.includes("localhost")) {
    const currentHost = window.location.hostname;
    if (currentHost !== "localhost" && currentHost !== "127.0.0.1") {
      baseUrl = baseUrl.replace("localhost", currentHost);
    }
  }

  if (!path) return baseUrl;
  if (/^https?:\/\//i.test(path)) return path;
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getAuthHeaders(token, headers = {}) {
  return {
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function readApiError(response, fallback = "Request failed") {
  try {
    const data = await response.json();
    return data?.message || data?.error || fallback;
  } catch {
    try {
      return (await response.text()) || fallback;
    } catch {
      return fallback;
    }
  }
}

export async function apiFetch(path, { token, headers, ...options } = {}) {
  return fetch(getApiUrl(path), {
    credentials: "include",
    ...options,
    headers: getAuthHeaders(token, headers),
  });
}

export function downloadBlob(blob, filename = "download") {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}

export function getFilenameFromContentDisposition(headerValue, fallback = "download") {
  const match = String(headerValue || "").match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i);
  return match ? decodeURIComponent(match[1]) : fallback;
}

export async function downloadApiFile(path, { token, filename = "download" } = {}) {
  const response = await apiFetch(path, { token });
  if (!response.ok) {
    throw new Error(await readApiError(response, "Failed to download file"));
  }

  const resolvedFilename = getFilenameFromContentDisposition(
    response.headers.get("Content-Disposition"),
    filename,
  );
  downloadBlob(await response.blob(), resolvedFilename);
}

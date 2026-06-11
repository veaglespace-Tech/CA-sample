
import { downloadBlob } from "./api/client";

export function getYoutubeEmbedUrl(url) {
  if (!url) return "";
  
  let videoId = "";
  if (url.includes("v=")) {
    videoId = url.split("v=")[1].split("&")[0];
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0];
  } else if (url.includes("embed/")) {
    videoId = url.split("embed/")[1].split("?")[0];
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

export async function forceDownload(url, filename) {
  if (!url) return;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    downloadBlob(await response.blob(), filename || "download");
  } catch (error) {
    console.error("Download failed:", error);
    // Fallback: open in new tab if fetching fails (e.g. CORS issues)
    window.open(url, "_blank");
  }
}

export function parseCurrencyAmount(value) {
  const numeric = Number.parseFloat(String(value || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
}

export function formatInrAmount(value) {
  const numeric = parseCurrencyAmount(value);
  if (numeric === null) return String(value || "");
  return `₹${numeric.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

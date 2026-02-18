import type { WeatherSnapshot } from "../types.js";

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

interface OpenMeteoCurrent {
  time?: string;
  snowfall?: number | null;
  snow_depth?: number | null;
}

interface OpenMeteoResponse {
  current?: OpenMeteoCurrent;
}

export const fetchCurrentSnow = async (
  latitude: number,
  longitude: number,
  timeoutMs: number
): Promise<WeatherSnapshot> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = new URL(OPEN_METEO_URL);
    url.searchParams.set("latitude", String(latitude));
    url.searchParams.set("longitude", String(longitude));
    url.searchParams.set("current", "snowfall,snow_depth");
    url.searchParams.set("timezone", "America/Phoenix");

    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Open-Meteo request failed: ${response.status} ${response.statusText}`);
    }

    const payload = (await response.json()) as OpenMeteoResponse;
    const current = payload.current ?? {};

    return {
      observationTime: current.time ?? null,
      snowfallMm: current.snowfall ?? null,
      snowDepthM: current.snow_depth ?? null
    };
  } finally {
    clearTimeout(timeout);
  }
};

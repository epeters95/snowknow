import type { LocationConfig, WeatherSnapshot } from "../types.js";

export const SNOWFALL_THRESHOLD_MM = 0.2;
export const SNOW_DEPTH_THRESHOLD_M = 0.01;
export const NEW_SNOWFALL_THRESHOLD_MM = 25.4;

export const isSnowy = (location: LocationConfig, weather: WeatherSnapshot): boolean => {
  if (location.triggerType === "new_snowfall") {
    return weather.snowfallMm !== null && weather.snowfallMm >= NEW_SNOWFALL_THRESHOLD_MM;
  }

  const snowfallHit = weather.snowfallMm !== null && weather.snowfallMm >= SNOWFALL_THRESHOLD_MM;
  const snowDepthHit = weather.snowDepthM !== null && weather.snowDepthM >= SNOW_DEPTH_THRESHOLD_M;

  return snowfallHit || snowDepthHit;
};

export const createSnowMessage = (location: LocationConfig, weather: WeatherSnapshot): string => {
  const triggerSummary =
    location.triggerType === "new_snowfall"
      ? `Trigger: new snowfall >= ${NEW_SNOWFALL_THRESHOLD_MM} mm`
      : `Trigger: snowfall >= ${SNOWFALL_THRESHOLD_MM} mm or snow depth >= ${SNOW_DEPTH_THRESHOLD_M} m`;
  const snowMessage =
    location.triggerType === "any_snow"
      ? `${location.name} looks snowy.`
      : `${location.name} is getting dusted.`;

  return [
    snowMessage,
    `Snowfall: ${weather.snowfallMm ?? "n/a"} mm`,
    `Snow depth: ${weather.snowDepthM ?? "n/a"} m`,
    triggerSummary,
    `Observed: ${weather.observationTime ?? "n/a"}`
  ].join(" ");
};

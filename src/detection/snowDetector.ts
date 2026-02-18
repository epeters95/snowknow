import type { LocationConfig, WeatherSnapshot } from "../types.js";

export const isSnowy = (location: LocationConfig, weather: WeatherSnapshot): boolean => {
  const snowfallHit =
    weather.snowfallMm !== null && weather.snowfallMm >= location.snowfallThresholdMm;
  const snowDepthHit =
    weather.snowDepthM !== null && weather.snowDepthM >= location.snowDepthThresholdM;

  return snowfallHit || snowDepthHit;
};

export const createSnowMessage = (location: LocationConfig, weather: WeatherSnapshot): string => {
  return [
    `${location.name} looks snowy.`,
    `Snowfall: ${weather.snowfallMm ?? "n/a"} mm`,
    `Snow depth: ${weather.snowDepthM ?? "n/a"} m`,
    `Observed: ${weather.observationTime ?? "n/a"}`
  ].join(" ");
};

import { describe, expect, test } from "vitest";
import {
  NEW_SNOWFALL_THRESHOLD_MM,
  isSnowy
} from "../src/detection/snowDetector.js";
import type { LocationConfig } from "../src/types.js";

const baseLocation: LocationConfig = {
  id: "mt-lemmon",
  name: "Mt Lemmon",
  latitude: 32.4426,
  longitude: -110.7883,
  triggerType: "any_snow",
  enabled: true
};

describe("isSnowy", () => {
  test("returns true when snowfall threshold is met", () => {
    const result = isSnowy(baseLocation, {
      observationTime: "2026-02-18T10:00",
      snowfallMm: 0.25,
      snowDepthM: 0
    });
    expect(result).toBe(true);
  });

  test("returns true when snow depth threshold is met", () => {
    const result = isSnowy(baseLocation, {
      observationTime: "2026-02-18T10:00",
      snowfallMm: 0,
      snowDepthM: 0.05
    });
    expect(result).toBe(true);
  });

  test("returns false when neither threshold is met", () => {
    const result = isSnowy(baseLocation, {
      observationTime: "2026-02-18T10:00",
      snowfallMm: 0,
      snowDepthM: 0
    });
    expect(result).toBe(false);
  });

  test("supports new snowfall trigger with 1 inch threshold", () => {
    const location: LocationConfig = {
      ...baseLocation,
      id: "arizona-snowbowl",
      name: "Arizona Snowbowl",
      triggerType: "new_snowfall"
    };

    const result = isSnowy(location, {
      observationTime: "2026-02-18T10:00",
      snowfallMm: NEW_SNOWFALL_THRESHOLD_MM + 0.1,
      snowDepthM: 0
    });

    expect(result).toBe(true);
  });

  test("new snowfall trigger ignores snow depth-only condition", () => {
    const location: LocationConfig = {
      ...baseLocation,
      id: "sunrise-park-resort",
      name: "Sunrise Park Resort",
      triggerType: "new_snowfall"
    };

    const result = isSnowy(location, {
      observationTime: "2026-02-18T10:00",
      snowfallMm: 5,
      snowDepthM: 1
    });

    expect(result).toBe(false);
  });
});

import { describe, expect, test } from "vitest";
import { isSnowy } from "../src/detection/snowDetector.js";
import type { LocationConfig } from "../src/types.js";

const baseLocation: LocationConfig = {
  id: "mt-lemmon",
  name: "Mt Lemmon",
  latitude: 32.4426,
  longitude: -110.7883,
  snowfallThresholdMm: 0.2,
  snowDepthThresholdM: 0.01,
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
});

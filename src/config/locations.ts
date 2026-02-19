import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";
import type { LocationConfig } from "../types.js";

const locationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  triggerType: z.enum(["any_snow", "new_snowfall"]).default("any_snow"),
  enabled: z.boolean().default(true)
});

const locationsFileSchema = z.object({
  locations: z.array(locationSchema).min(1)
});

export const loadLocations = async (locationsFile: string): Promise<LocationConfig[]> => {
  const resolvedPath = path.resolve(process.cwd(), locationsFile);
  const raw = await fs.readFile(resolvedPath, "utf-8");
  const parsed = locationsFileSchema.parse(JSON.parse(raw));
  const ids = new Set<string>();

  for (const location of parsed.locations) {
    if (ids.has(location.id)) {
      throw new Error(`Duplicate location id found: ${location.id}`);
    }
    ids.add(location.id);
  }

  return parsed.locations;
};

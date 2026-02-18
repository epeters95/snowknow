import dotenv from "dotenv";
import { z } from "zod";
import type { EnvConfig } from "../types.js";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  SCHEDULER_MODE: z.enum(["none", "local"]).default("none"),
  CRON_SCHEDULE: z.string().min(1).default("*/30 * * * *"),
  LOCATIONS_FILE: z.string().min(1).default("config/locations.json"),
  HISTORY_FILE: z.string().min(1).default("data/check-history.json"),
  HISTORY_LIMIT: z.coerce.number().int().positive().default(500),
  OPEN_METEO_TIMEOUT_MS: z.coerce.number().int().positive().default(15000),
  PUSHOVER_APP_TOKEN: z.string().min(1, "PUSHOVER_APP_TOKEN is required"),
  PUSHOVER_USER_KEY: z.string().min(1, "PUSHOVER_USER_KEY is required")
});

export const loadEnv = (): EnvConfig => envSchema.parse(process.env);

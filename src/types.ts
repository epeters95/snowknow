export type SchedulerMode = "none" | "local";
export type CheckSource = "manual" | "scheduler" | "api" | "github-actions";

export interface EnvConfig {
  PORT: number;
  SCHEDULER_MODE: SchedulerMode;
  CRON_SCHEDULE: string;
  LOCATIONS_FILE: string;
  HISTORY_FILE: string;
  HISTORY_LIMIT: number;
  OPEN_METEO_TIMEOUT_MS: number;
  PUSHOVER_APP_TOKEN: string;
  PUSHOVER_USER_KEY: string;
}

export interface LocationConfig {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  snowfallThresholdMm: number;
  snowDepthThresholdM: number;
  enabled: boolean;
}

export interface WeatherSnapshot {
  observationTime: string | null;
  snowfallMm: number | null;
  snowDepthM: number | null;
}

export interface NotificationPayload {
  title: string;
  message: string;
}

export interface NotificationResult {
  provider: string;
  id?: string;
}

export interface LocationCheckResult {
  locationId: string;
  locationName: string;
  checkedAt: string;
  source: CheckSource;
  snowy: boolean;
  notified: boolean;
  weather: WeatherSnapshot;
  error?: string;
  notificationId?: string;
}

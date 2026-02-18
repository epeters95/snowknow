import { loadLocations } from "../config/locations.js";
import { createSnowMessage, isSnowy } from "../detection/snowDetector.js";
import type { Notifier } from "../notifiers/notifier.js";
import { HistoryStore } from "../store/historyStore.js";
import type { CheckSource, EnvConfig, LocationCheckResult } from "../types.js";
import { fetchCurrentSnow } from "../weather/openMeteoClient.js";

export class SnowCheckService {
  constructor(
    private readonly env: EnvConfig,
    private readonly notifier: Notifier,
    private readonly historyStore: HistoryStore
  ) {}

  async getLocations() {
    return loadLocations(this.env.LOCATIONS_FILE);
  }

  async getHistory(limit: number) {
    return this.historyStore.list(limit);
  }

  async check(source: CheckSource, locationIds?: string[]): Promise<LocationCheckResult[]> {
    const allLocations = await loadLocations(this.env.LOCATIONS_FILE);
    const targetLocations = allLocations.filter((location) => {
      if (!location.enabled) {
        return false;
      }
      if (!locationIds || locationIds.length === 0) {
        return true;
      }
      return locationIds.includes(location.id);
    });

    const results: LocationCheckResult[] = [];

    for (const location of targetLocations) {
      const checkedAt = new Date().toISOString();
      try {
        const weather = await fetchCurrentSnow(
          location.latitude,
          location.longitude,
          this.env.OPEN_METEO_TIMEOUT_MS
        );
        const snowy = isSnowy(location, weather);

        let notified = false;
        let notificationId: string | undefined;
        if (snowy) {
          const message = createSnowMessage(location, weather);
          const notifyResult = await this.notifier.send({
            title: "SnowKnow Alert",
            message
          });
          notified = true;
          notificationId = notifyResult.id;
        }

        results.push({
          locationId: location.id,
          locationName: location.name,
          checkedAt,
          source,
          snowy,
          notified,
          notificationId,
          weather
        });
      } catch (error) {
        results.push({
          locationId: location.id,
          locationName: location.name,
          checkedAt,
          source,
          snowy: false,
          notified: false,
          weather: {
            observationTime: null,
            snowfallMm: null,
            snowDepthM: null
          },
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }

    await this.historyStore.appendMany(results);
    return results;
  }
}

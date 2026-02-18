import { loadEnv } from "../config/env.js";
import { PushoverNotifier } from "../notifiers/pushoverNotifier.js";
import { SnowCheckService } from "../services/snowCheckService.js";
import { HistoryStore } from "../store/historyStore.js";
import type { CheckSource } from "../types.js";

const allowedSources: CheckSource[] = ["manual", "scheduler", "api", "github-actions"];

const toSource = (value: string | undefined): CheckSource => {
  if (!value) {
    return "manual";
  }
  if (allowedSources.includes(value as CheckSource)) {
    return value as CheckSource;
  }
  throw new Error(`Invalid CHECK_SOURCE "${value}"`);
};

const run = async () => {
  const env = loadEnv();
  const notifier = new PushoverNotifier(env.PUSHOVER_APP_TOKEN, env.PUSHOVER_USER_KEY);
  const historyStore = new HistoryStore(env.HISTORY_FILE, env.HISTORY_LIMIT);
  const service = new SnowCheckService(env, notifier, historyStore);
  const source = toSource(process.env.CHECK_SOURCE);

  const results = await service.check(source);
  console.log(JSON.stringify(results, null, 2));

  const hasErrors = results.some((result) => Boolean(result.error));
  if (hasErrors) {
    process.exitCode = 1;
  }
};

void run().catch((error) => {
  console.error(error);
  process.exit(1);
});

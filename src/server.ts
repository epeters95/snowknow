import { createApp } from "./app.js";
import { loadEnv } from "./config/env.js";
import { PushoverNotifier } from "./notifiers/pushoverNotifier.js";
import { startLocalScheduler } from "./scheduler/localScheduler.js";
import { SnowCheckService } from "./services/snowCheckService.js";
import { HistoryStore } from "./store/historyStore.js";

const env = loadEnv();
const notifier = new PushoverNotifier(env.PUSHOVER_APP_TOKEN, env.PUSHOVER_USER_KEY);
const historyStore = new HistoryStore(env.HISTORY_FILE, env.HISTORY_LIMIT);
const service = new SnowCheckService(env, notifier, historyStore);
const app = createApp(service);

const server = app.listen(env.PORT, () => {
  console.log(`SnowKnow API listening on http://localhost:${env.PORT}`);
});

let schedulerStop: (() => void) | undefined;
if (env.SCHEDULER_MODE === "local") {
  const task = startLocalScheduler(env.CRON_SCHEDULE, async () => {
    const results = await service.check("scheduler");
    console.log("Scheduled check results:", JSON.stringify(results, null, 2));
  });
  schedulerStop = () => task.stop();
  console.log(`Local scheduler enabled with CRON "${env.CRON_SCHEDULE}"`);
}

const shutdown = () => {
  schedulerStop?.();
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

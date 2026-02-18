import cron from "node-cron";

export const startLocalScheduler = (schedule: string, handler: () => Promise<void>) => {
  const task = cron.schedule(schedule, () => {
    void handler().catch((error) => {
      console.error("Scheduled check failed:", error);
    });
  });

  return task;
};

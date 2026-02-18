import express from "express";
import { z } from "zod";
import { SnowCheckService } from "./services/snowCheckService.js";

const checkBodySchema = z.object({
  locationIds: z.array(z.string().min(1)).optional()
});

const historyQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(1000).default(50)
});

export const createApp = (service: SnowCheckService) => {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "snowknow", timestamp: new Date().toISOString() });
  });

  app.get("/api/locations", async (_req, res) => {
    try {
      const locations = await service.getLocations();
      res.json({ locations });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to load locations"
      });
    }
  });

  app.post("/api/check", async (req, res) => {
    try {
      const body = checkBodySchema.parse(req.body ?? {});
      const results = await service.check("api", body.locationIds);
      console.log(
        "[/api/check] results:",
        JSON.stringify(
          {
            timestamp: new Date().toISOString(),
            requestedLocationIds: body.locationIds ?? null,
            resultCount: results.length,
            results
          },
          null,
          2
        )
      );
      res.json({ results });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "Invalid request"
      });
    }
  });

  app.get("/api/history", async (req, res) => {
    try {
      const query = historyQuerySchema.parse(req.query ?? {});
      const history = await service.getHistory(query.limit);
      res.json({ history });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "Invalid request"
      });
    }
  });

  return app;
};

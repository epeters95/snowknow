import { promises as fs } from "node:fs";
import path from "node:path";
import type { LocationCheckResult } from "../types.js";

export class HistoryStore {
  private readonly historyPath: string;

  constructor(filePath: string, private readonly limit: number) {
    this.historyPath = path.resolve(process.cwd(), filePath);
  }

  async list(maxItems = 50): Promise<LocationCheckResult[]> {
    const all = await this.readAll();
    return all.slice(-maxItems).reverse();
  }

  async appendMany(results: LocationCheckResult[]): Promise<void> {
    if (results.length === 0) {
      return;
    }

    const all = await this.readAll();
    const merged = [...all, ...results];
    const trimmed = merged.slice(-this.limit);
    await this.writeAll(trimmed);
  }

  private async readAll(): Promise<LocationCheckResult[]> {
    try {
      const raw = await fs.readFile(this.historyPath, "utf-8");
      const parsed = JSON.parse(raw) as LocationCheckResult[];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      const maybeErr = error as NodeJS.ErrnoException;
      if (maybeErr.code === "ENOENT") {
        return [];
      }
      throw error;
    }
  }

  private async writeAll(records: LocationCheckResult[]): Promise<void> {
    await fs.mkdir(path.dirname(this.historyPath), { recursive: true });
    await fs.writeFile(this.historyPath, JSON.stringify(records, null, 2), "utf-8");
  }
}

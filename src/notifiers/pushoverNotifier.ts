import type { NotificationPayload, NotificationResult } from "../types.js";
import type { Notifier } from "./notifier.js";

interface PushoverResponse {
  status: number;
  request: string;
}

export class PushoverNotifier implements Notifier {
  private readonly endpoint = "https://api.pushover.net/1/messages.json";

  constructor(
    private readonly appToken: string,
    private readonly userKey: string
  ) {}

  async send(payload: NotificationPayload): Promise<NotificationResult> {
    const body = new URLSearchParams({
      token: this.appToken,
      user: this.userKey,
      title: payload.title,
      message: payload.message
    });

    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });

    const raw = await response.text();
    if (!response.ok) {
      throw new Error(`Pushover request failed: ${response.status} ${raw}`);
    }

    const parsed = JSON.parse(raw) as PushoverResponse;
    if (parsed.status !== 1) {
      throw new Error(`Pushover error: ${raw}`);
    }

    return {
      provider: "pushover",
      id: parsed.request
    };
  }
}

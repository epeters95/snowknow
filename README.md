# SnowKnow

SnowKnow checks configured mountain locations using Open-Meteo and sends a Pushover notification whenever snow is detected.

## Stack

- Node.js `22.12+`
- TypeScript
- Express API
- Open-Meteo weather data
- Pushover notifications

## Features

- Multi-location config (`config/locations.json`)
- Notification behavior: alert on every snowy check
- Two scheduling modes:
  - Local cron scheduler in the app
  - GitHub Actions scheduled job
- JSON history store for future UI/API use

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env
```

3. Set required values in `.env`:

- `PUSHOVER_APP_TOKEN`
- `PUSHOVER_USER_KEY`

4. Run one check:

```bash
npm run check
```

5. Start API server:

```bash
npm run dev
```

## API Endpoints

- `GET /health`
- `GET /api/locations`
- `POST /api/check`
  - body (optional): `{ "locationIds": ["mt-lemmon"] }`
- `GET /api/history?limit=50`

## Location Config

Edit `config/locations.json`:

```json
{
  "locations": [
    {
      "id": "mt-lemmon",
      "name": "Mt Lemmon",
      "latitude": 32.4426,
      "longitude": -110.7883,
      "triggerType": "any_snow",
      "enabled": true
    }
  ]
}
```

Trigger options:

- `triggerType: "any_snow"` uses global thresholds from `src/detection/snowDetector.ts`
- `triggerType: "new_snowfall"` uses global new snowfall threshold from `src/detection/snowDetector.ts`

## Scheduling Modes

### Local Scheduler

Set in `.env`:

```bash
SCHEDULER_MODE=local
CRON_SCHEDULE=*/30 * * * *
```

Then run:

```bash
npm run dev
```

### GitHub Actions Scheduler

Workflow file: `.github/workflows/snow-check.yml`

Required repo secrets:

- `PUSHOVER_APP_TOKEN`
- `PUSHOVER_USER_KEY`

Default schedule is every 30 minutes.

## NPM Scripts

- `npm run dev` - start API + optional local scheduler
- `npm run check` - run one weather check pass
- `npm run build` - compile TS to `dist/`
- `npm run start` - run compiled server
- `npm run typecheck` - TypeScript checks
- `npm run test` - run tests

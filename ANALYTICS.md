# Analytics & Data-Ready Architecture (Design + Install)

This document describes a compact, data-ready architecture for analytics for CivicConnect and provides quick terminal install commands to get started.

## Goals (what this project is designed for)
- Designed for analytics: complaint data is stored with timestamps, categories, locations, priority and assignment information so it can be aggregated.
- Complaint trend analysis possible: time-series aggregations (daily/weekly/monthly counts, category trends, area heatmaps).
- Town infrastructure stress detection: rolling-window alerts and heatmaps to detect abnormal concentration of complaints by town/category.

## Data model (key fields to keep / enrich)
- Complaint (existing):
  - id / _id, title, description
  - createdAt, updatedAt (timestamps)
  - town, locationText, coords (lat/lng)
  - category, priority
  - status, assignedTo (empId or _id)
  - targetLocation (structured), estimatedHours, actualHours

- User / Employee:
  - _id, name, email, empId, department, currentLocation

Design note: keep `createdAt` indexed and store `coords` (GeoJSON) for geospatial queries/heatmaps.

## Backend: analytics-ready endpoints (suggested)
- `GET /api/analytics/trends?groupBy=day&from=YYYY-MM-DD&to=YYYY-MM-DD&town=...&category=...`
  - Returns time-series counts by group (day/week/month) and category.
- `GET /api/analytics/top-areas?from=...&to=...&limit=20`
  - Returns areas/towns with most complaints.
- `GET /api/analytics/heatmap?from=...&to=...&category=...`
  - Returns aggregated geo-buckets or raw coordinates for frontend heatmap.
- `GET /api/analytics/alerts` (optional)
  - Returns detected stress events (e.g., sudden spikes) for monitoring.

Implementation notes:
- Use MongoDB aggregation pipelines (no extra DB required) for prototyping.
- For heavy analytics, consider TimescaleDB / Postgres or Elasticsearch for full-text & geo aggregations.

## Frontend: dashboard components (suggested)
- `AnalyticsDashboard.jsx` (protected admin view)
  - Trend charts (line/bar) for complaint counts over time
  - Top categories / top areas (bar charts)
  - Heatmap view (leaflet / mapbox) for locations
  - Alerts panel for detected stress events

Suggested chart libraries:
- `react-chartjs-2` + `chart.js` — fast to integrate
- `react-leaflet` or Mapbox GL for maps/heatmaps

## Quick install (terminal commands)
Run these from the repo root. Use PowerShell on Windows (copy-paste each block into the appropriate shell).

- Frontend (inside `frontend/`) — add chart + map libs:

  cd frontend
  npm install react-chartjs-2 chart.js react-leaflet leaflet axios

- Backend (inside `server/`) — helpers for aggregation, metrics, cron jobs:

  cd server
  npm install lodash moment express-prometheus-middleware prom-client node-cron

  // prom-client if you want Prometheus metrics endpoint for service monitoring
  npm install prom-client

- Optional: Docker-based analytics stack (TimescaleDB + Grafana)

  # Requires Docker installed
  docker pull timescale/timescaledb:latest-pg14
  docker pull grafana/grafana:latest

  # Or with Elasticsearch + Kibana for geo/aggregations
  docker pull docker.elastic.co/elasticsearch/elasticsearch:8.10.0
  docker pull docker.elastic.co/kibana/kibana:8.10.0

Notes:
- MongoDB aggregations should be sufficient for initial trend analysis; no new DB required.
- If you choose TimescaleDB or Elasticsearch, use docker-compose to stand up a small stack for examples.

## Example minimal aggregation (MongoDB) — server side (pseudo-code)

// In `server/src/routes/analytics.js` (example)
// Aggregation: daily complaints count by category

const express = require('express');
const Complaint = require('../models/Complaint');
const router = express.Router();

router.get('/trends', async (req, res) => {
  const { from, to, groupBy = 'day', category } = req.query;
  const match = {};
  if (from) match.createdAt = { $gte: new Date(from) };
  if (to) match.createdAt = match.createdAt || {};
  if (to) match.createdAt.$lte = new Date(to);
  if (category) match.category = category;

  const dateTrunc = {
    day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
    month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
  }[groupBy] || { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };

  const pipeline = [
    { $match: match },
    { $group: { _id: dateTrunc, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ];

  const result = await Complaint.aggregate(pipeline);
  res.json(result);
});

module.exports = router;

## Next steps I can do for you (pick one):
- Implement the example `/api/analytics/trends` endpoint in `server/src/routes/analytics.js` and wire it into `server/src/index.js`.
- Create `frontend/src/pages/AnalyticsDashboard.jsx` with sample charts using `react-chartjs-2` and fetch from the new endpoint.
- Provide a `docker-compose.yml` snippet to run TimescaleDB + Grafana for long-term analytics.

---
If you want, I can implement the `/api/analytics/trends` endpoint now and scaffold a simple frontend dashboard (requires me to add files and run installs). Which of the next steps should I do first?
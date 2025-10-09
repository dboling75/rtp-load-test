# Conversation Summary — Visualizations & Runner (Docker Compose)

We added Docker Compose-based **InfluxDB v2 + Grafana** and an on-demand **k6-runner** service.

## Visualization Options
- **k6 local web dashboard**: `--out web-dashboard` (live charts at http://localhost:5665)
- **InfluxDB v2 + Grafana**: persistent metrics, import community k6 dashboards
- **Grafana Cloud k6**: hosted option for teams

## Compose Commands
- Start infra: `docker compose up -d influxdb grafana`
- Run default test: `docker compose run --rm --profile runner k6-runner`
- Run smoke test: `docker compose run --rm --profile runner -e K6_SCRIPT=/scripts/test_smoke.js k6-runner`

## Notes
- Runner streams to InfluxDB via `/api/v2/write?...` (org/bucket/token from `.env`)
- Grafana connects to `http://influxdb:8086` (Flux, org, bucket, token)
- Results also written to `results/summary.json` via `handleSummary`

Next: convert Postman collections to k6, add endpoint-specific scripts and thresholds per TPS per endpoint.

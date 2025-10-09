# RTP API Performance & Smoke Test (Docker Compose)

This repo gives you:
- A **k6 runner** streaming to **InfluxDB v2** with **Grafana** dashboards.
- A configurable **smoke test** (`scripts/test_smoke.js`) and a simple **example** (`scripts/example.js`).

## Quick Start
```bash
cp .env.example .env
docker compose up -d influxdb grafana

# Default test (K6_SCRIPT from .env, defaults to /scripts/example.js)
docker compose run --rm --profile runner k6-runner

# Smoke test against your API
docker compose run --rm --profile runner -e K6_SCRIPT=/scripts/test_smoke.js k6-runner
```
- **InfluxDB UI**: http://localhost:8086  (org: `${DOCKER_INFLUXDB_INIT_ORG}`, bucket: `${DOCKER_INFLUXDB_INIT_BUCKET}`)
- **Grafana UI**:   http://localhost:3000  (user: `${GF_SECURITY_ADMIN_USER}`, pass: `${GF_SECURITY_ADMIN_PASSWORD}`)

### Configure Grafana → InfluxDB (Flux)
1. Data source URL: `http://influxdb:8086`
2. Organization: `${DOCKER_INFLUXDB_INIT_ORG}`
3. Token: `${DOCKER_INFLUXDB_INIT_ADMIN_TOKEN}`
4. Default Bucket: `${DOCKER_INFLUXDB_INIT_BUCKET}`
5. Import a community **k6** dashboard.

## Smoke Test Config
Edit `.env` or override at runtime:
- `BASE_URL`, `ENDPOINT_PATH`, `AUTH_MODE` = `none` or `bearer`
- Place JWT in `secrets/token.txt` or set `TOKEN` env var

## Local k6 Web Dashboard (no DB)
```bash
docker run --rm -p 5665:5665 -v "$PWD/scripts:/scripts:ro" grafana/k6:latest \  run --out web-dashboard=/ /scripts/example.js
# Open http://localhost:5665
```

## Test Plan
See `RTP_API_Performance_TestPlan.md` for throughput matrix, P90 targets, success criteria, and reporting.


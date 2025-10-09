# k6 + InfluxDB v2 + Grafana (Docker) with k6-runner

## Quick Start
```bash
cp .env.example .env
make up             # start InfluxDB and Grafana
make test           # run default k6 script
```

Grafana: http://localhost:3000 (admin/admin) — add InfluxDB data source:
- URL: http://influxdb:8086
- Query Language: Flux
- Organization: ${DOCKER_INFLUXDB_INIT_ORG}
- Token: ${DOCKER_INFLUXDB_INIT_ADMIN_TOKEN}
- Default Bucket: ${DOCKER_INFLUXDB_INIT_BUCKET}

Import a community k6 dashboard via Grafana's "Dashboards → Import".

## Env Profiles
- Copy `.env.stress.example` to `.env.stress` and tweak, then:
  ```bash
  make test-stress
  ```
- Copy `.env.prod.example` to `.env.prod` and tweak, then:
  ```bash
  make test-prod
  ```

## Run a different script
```bash
make test-file FILE=/scripts/example.js
```

## Reset
```bash
make reset
```

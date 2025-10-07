# RTP Smoke Test Repository

This repository contains the baseline **RTP API smoke test** using **k6** and **Podman Compose**.

## Structure
```
.
├── compose.yml          # Podman Compose definition for k6
├── .env                 # Environment configuration (edit this first)
├── .gitignore           # Git ignore rules for secrets/results
├── README-smoke.md      # Detailed smoke test guide
├── scripts/
│   └── test_smoke.js    # Minimal k6 smoke test script
├── secrets/
│   └── token.txt        # Optional bearer token
└── results/             # Output folder for k6 JSON summaries
```

## Quick Start
```bash
# 1. Configure environment
vi .env

# 2. Run smoke test
podman-compose up -d

# 3. View logs
podman logs -f k6-rtp-smoke

# 4. Stop and clean up
podman-compose down
```

## Expected Output
A short summary in logs similar to:
```
== Smoke Summary ==
P90: 145.00 ms
Errors: 0
Iterations: 60
```

Full results are written to `results/summary.json`.

## Next Steps
- Convert Postman tests to k6 scripts via `npx postman-to-k6`
- Integrate with InfluxDB + Grafana for trend tracking
- Scale from smoke to throughput testing using the RTP Performance Test Plan

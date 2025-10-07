# RTP Smoke Test (k6 + Podman Compose)

## Files
- `compose.yml` — Podman Compose definition for the k6 runner
- `.env` — environment config (BASE_URL, ENDPOINT_PATH, load shape, thresholds)
- `scripts/test_smoke.js` — minimal k6 script using constant arrival rate
- `secrets/token.txt` — optional bearer token (used if AUTH_MODE=bearer and TOKEN env not set)
- `results/` — output folder for `summary.json`

## Quick Start
```bash
cd rtp-smoke
# Edit .env to set BASE_URL and ENDPOINT_PATH; set AUTH_MODE=none or bearer
# If bearer, paste token into secrets/token.txt or set TOKEN in .env

podman-compose -f compose.yml up -d
podman logs -f k6-rtp-smoke
# When done
podman-compose -f compose.yml down
```

## Verify Artifacts
- `results/summary.json` contains P50/P90/P95/P99, error rates, and counts.
- Container logs will print a short summary footer.

## Common Tweaks
- Increase `RATE` or `DURATION` in `.env` to test higher RPS briefly.
- Change `ENDPOINT_PATH` to one of your four APIs for isolated checks.
- Set `AUTH_MODE=bearer` and provide a valid token (env `TOKEN` or `secrets/token.txt`).

## Notes
This is a **smoke** test, not a load or stress test. It should complete fast and fail only on obvious misconfig.

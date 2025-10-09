   .PHONY: up down logs reset test test-file test-stress test-prod env

   # Default env file
   ENV_FILE ?= .env

   up:
   	docker compose --env-file $(ENV_FILE) up -d

   down:
   	docker compose --env-file $(ENV_FILE) down

   reset:
   	docker compose --env-file $(ENV_FILE) down -v

   logs:
   	docker compose --env-file $(ENV_FILE) logs -f

   test:
   	docker compose --env-file $(ENV_FILE) run --rm --profile runner k6-runner

   # usage: make test-file FILE=/scripts/other.js [ENV_FILE=.env.stress]
   test-file:
   	docker compose --env-file $(ENV_FILE) run --rm --profile runner -e K6_SCRIPT=$(FILE) k6-runner

   # Convenience profiles with example env files
   # (copy .env.stress.example -> .env.stress and tweak)
   test-stress:
   	$(MAKE) test ENV_FILE=.env.stress

   # (copy .env.prod.example -> .env.prod and tweak)
   test-prod:
   	$(MAKE) test ENV_FILE=.env.prod

   env:
   	@echo Using env file: $(ENV_FILE)
&& cat $(ENV_FILE) || true

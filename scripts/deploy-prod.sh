#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .env.production ]; then
	echo "Missing .env.production."
	echo "Copy .env.production.example to .env.production and fill in the real values."
	exit 1
fi

if grep -qE "change-me|<ACCOUNT_ID>|re_xxxxxxxx" .env.production; then
	echo "Placeholder values found in .env.production."
	echo "Replace all change-me / <ACCOUNT_ID> / re_xxxxxxxx values before deploying."
	exit 1
fi

docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
docker compose --env-file .env.production -f docker-compose.prod.yml ps

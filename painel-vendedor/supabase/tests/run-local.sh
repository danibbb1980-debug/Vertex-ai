#!/usr/bin/env bash
# Sobe um Postgres 16 descartável, aplica o stub do Supabase + schema.sql,
# insere dados FALSOS de teste e roda as tentativas de ataque com a conta
# de vendedor. Tudo é apagado no fim.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
PGBIN="${PGBIN:-/usr/lib/postgresql/16/bin}"
TMP="$(mktemp -d)"
PORT="${PGPORT_TEST:-54329}"
trap '"$PGBIN/pg_ctl" -D "$TMP/data" -m immediate stop >/dev/null 2>&1 || true; rm -rf "$TMP"' EXIT
RUNAS=()
if [ "$(id -u)" = "0" ]; then chown -R postgres "$TMP"; RUNAS=(runuser -u postgres --); fi
"${RUNAS[@]}" "$PGBIN/initdb" -D "$TMP/data" -U postgres -A trust >/dev/null
"${RUNAS[@]}" "$PGBIN/pg_ctl" -D "$TMP/data" -o "-p $PORT -k $TMP -c listen_addresses=''" -l "$TMP/log" -w start >/dev/null
PSQL=(psql -h "$TMP" -p "$PORT" -U postgres -d postgres -v ON_ERROR_STOP=1 -q -X)
"${PSQL[@]}" -f "$HERE/supabase-stub.sql"
"${PSQL[@]}" -f "$HERE/../schema.sql"
"${PSQL[@]}" -f "$HERE/seed-teste.sql"
"${PSQL[@]}" -P pager=off -f "$HERE/rls-ataques.sql"

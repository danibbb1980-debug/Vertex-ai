#!/usr/bin/env bash
# Sobe um Postgres 16 descartável e testa o banco do jeito que ele evolui:
#   stub do Supabase -> schema.sql (v1) -> dados FALSOS no formato v1 ->
#   migrações -> ataques e regras -> reverte -> confere -> reaplica.
# Tudo é apagado no fim.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
MIG="$HERE/../migrations"
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
for f in $(ls "$MIG"/*.sql | grep -v _reverter.sql | sort); do "${PSQL[@]}" -f "$f"; done
"${PSQL[@]}" -P pager=off -f "$HERE/rls-ataques.sql"

echo
echo "== Reversão da migração e reaplicação =="
ANTES=$("${PSQL[@]}" -At -c "select count(*) || '/' || (select count(*) from public.comissoes) || '/' || (select sum(base_calculo) from public.comissoes) from public.vendas")
for f in $(ls "$MIG"/*_reverter.sql | sort -r); do "${PSQL[@]}" -f "$f"; done
"${PSQL[@]}" -At -c "select 'v1 restaurada: ' || (select string_agg(column_name, ',' order by column_name) from information_schema.columns where table_name = 'comissoes' and column_name in ('percentual','status','data_pagamento')) || ' | registrar_pagamento=' || (to_regprocedure('public.registrar_pagamento(uuid,numeric,numeric,date,numeric)') is not null)"
DEPOIS_DOWN=$("${PSQL[@]}" -At -c "select count(*) || '/' || (select count(*) from public.comissoes) || '/' || (select sum(base_calculo) from public.comissoes) from public.vendas")
for f in $(ls "$MIG"/*.sql | grep -v _reverter.sql | sort); do "${PSQL[@]}" -f "$f"; done
DEPOIS_UP=$("${PSQL[@]}" -At -c "select count(*) || '/' || (select count(*) from public.comissoes) || '/' || (select sum(base_calculo) from public.comissoes) from public.vendas")
echo "vendas/comissões/soma das bases: antes=$ANTES depois_de_reverter=$DEPOIS_DOWN depois_de_reaplicar=$DEPOIS_UP"
if [ "$ANTES" != "$DEPOIS_DOWN" ] || [ "$ANTES" != "$DEPOIS_UP" ]; then echo "FALHOU: dados mudaram"; exit 1; fi
echo "OK: reverter e reaplicar preservam os dados"

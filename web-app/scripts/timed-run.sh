#!/usr/bin/env bash
set -euo pipefail

EXPECTED=${1:-0}
shift || true
if [ $# -eq 0 ]; then
  echo "Usage: $0 <expected_seconds> <command...>"
  exit 2
fi
CMD="$@"
START=$(date +%s)
printf "Starting: %s\n" "$CMD"

# run command in background
bash -c "$CMD" &
PID=$!

while kill -0 "$PID" 2>/dev/null; do
  ELAPSED=$(( $(date +%s) - START ))
  if [ "$EXPECTED" -gt 0 ]; then
    REM=$((EXPECTED - ELAPSED))
    if [ $REM -lt 0 ]; then REM=0; fi
    PCT=$(( ELAPSED * 100 / (EXPECTED) ))
    if [ $PCT -gt 100 ]; then PCT=100; fi
    printf "\rElapsed: %ds — ETA: %ds (%d%%)     " "$ELAPSED" "$REM" "$PCT"
  else
    printf "\rElapsed: %ds                      " "$ELAPSED"
  fi
  sleep 5
done

wait "$PID"
EXIT=$?
ELAPSED=$(( $(date +%s) - START ))
printf "\nFinished in %ds with exit %d\n" "$ELAPSED" "$EXIT"
exit $EXIT

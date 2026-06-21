#!/usr/bin/env sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
ATTACKER_ROOT=/tmp/power-line-map-attacker-root
TEMP_ROOT=$(mktemp -d "${TMPDIR:-/tmp}/Power Line Map's [gate] XXXX")
trap 'rm -rf "$TEMP_ROOT"' EXIT HUP INT TERM
CHECKOUT="$TEMP_ROOT/exact head"
mkdir -p "$CHECKOUT"
cp "$ROOT_DIR/Makefile" "$CHECKOUT/Makefile"

assert_plan() {
  scenario=$1 target=$2 output=$3
  printf '%s' "$output" | grep -Fq "$CHECKOUT" || { printf '%s\n' "$scenario $target did not use $CHECKOUT" >&2; exit 1; }
  if printf '%s' "$output" | grep -Fq "$ATTACKER_ROOT"; then printf '%s\n' "$scenario $target accepted attacker root" >&2; exit 1; fi
}

for target in build check lint root-test test verify; do
  output=$(make --no-print-directory --dry-run --file "$CHECKOUT/Makefile" "$target" 2>&1); assert_plan default "$target" "$output"
  output=$(make --no-print-directory --dry-run --file "$CHECKOUT/Makefile" "REPO_ROOT=$ATTACKER_ROOT" "$target" 2>&1); assert_plan command-override "$target" "$output"
  output=$(REPO_ROOT=$ATTACKER_ROOT make --no-print-directory --dry-run --file "$CHECKOUT/Makefile" "$target" 2>&1); assert_plan environment-override "$target" "$output"
done

if make --no-print-directory --dry-run --file "$CHECKOUT/Makefile" MAKEFILE_LIST=/tmp/untrusted check >"$TEMP_ROOT/command.out" 2>&1; then exit 1; fi
grep -Fq "MAKEFILE_LIST must not be overridden" "$TEMP_ROOT/command.out"
if MAKEFILE_LIST=/tmp/untrusted make --environment-overrides --no-print-directory --dry-run --file "$CHECKOUT/Makefile" check >"$TEMP_ROOT/environment.out" 2>&1; then exit 1; fi
grep -Fq "MAKEFILE_LIST must not be overridden" "$TEMP_ROOT/environment.out"
printf '%s\n' "Makefile root tests passed: 18 target/override cases and 2 MAKEFILE_LIST rejection cases"

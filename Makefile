.PHONY: check lint test build verify

override REPO_ROOT := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))

check: verify

lint:
	cd "$(REPO_ROOT)" && node scripts/check-map-assets.js

test: lint
	cd "$(REPO_ROOT)" && node scripts/test-geojson-validation.js
	cd "$(REPO_ROOT)" && node scripts/test-map-behavior.js

build: lint

verify: lint test build

.PHONY: check lint test build verify

override REPO_ROOT := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))

check: verify

lint:
	cd "$(REPO_ROOT)" && node --check scripts/check-map-assets.js
	cd "$(REPO_ROOT)" && node --check scripts/test-geojson-validation.js
	cd "$(REPO_ROOT)" && node --check scripts/test-map-behavior.js
	cd "$(REPO_ROOT)" && node --check scripts/test-mapbox-integrity.js
	cd "$(REPO_ROOT)" && node scripts/check-map-assets.js

test: lint
	cd "$(REPO_ROOT)" && node scripts/test-geojson-validation.js
	cd "$(REPO_ROOT)" && node scripts/test-map-behavior.js
	cd "$(REPO_ROOT)" && node scripts/test-mapbox-integrity.js

build: lint

verify: lint test build

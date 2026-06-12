.PHONY: check lint test build verify

check: verify

lint:
	node --check scripts/check-map-assets.js
	node --check scripts/test-map-behavior.js
	node --check scripts/test-mapbox-integrity.js
	node scripts/check-map-assets.js

test: lint
	node scripts/test-map-behavior.js
	node scripts/test-mapbox-integrity.js

build: lint

verify: lint test build

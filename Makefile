.PHONY: check lint test build verify

check: verify

lint:
	node scripts/check-map-assets.js

test: lint
	node scripts/test-map-behavior.js

build: lint

verify: lint test build

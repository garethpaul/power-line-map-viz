.PHONY: check lint test build verify

check: verify

lint:
	node scripts/check-map-assets.js

test: lint

build: lint

verify: lint test build

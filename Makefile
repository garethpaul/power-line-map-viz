.PHONY: check lint test verify

check: verify

lint:
	node scripts/check-map-assets.js

test: lint

verify: lint

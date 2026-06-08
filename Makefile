.PHONY: lint test verify

lint:
	node scripts/check-map-assets.js

test: lint

verify: lint

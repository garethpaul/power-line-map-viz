.PHONY: check lint test build root-test verify

ifneq ($(origin MAKEFILE_LIST),file)
$(error MAKEFILE_LIST must not be overridden)
endif
override REPO_ROOT := $(shell path='$(subst ','"'"',$(MAKEFILE_LIST))'; path=$$(printf '%s' "$$path" | /usr/bin/sed 's/^ //'); directory=$$(/usr/bin/dirname -- "$$path"); CDPATH= cd -- "$$directory" && /bin/pwd -P)

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

root-test:
	cd "$(REPO_ROOT)" && scripts/test-makefile-root.sh

verify: lint test build root-test

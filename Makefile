SRC_DIR = src
TEST_DIR = test
BUILD_DIR = build
REPORTS_DIR = reports
NODE_MODULES_BIN = ./node_modules/.bin

quickstart: help

install:
	docker compose run --rm app bun i

start:
	docker compose run --rm app bun run src/index.ts

typecheck:
	docker compose run --rm app bun tsc

test:
	docker compose run --rm app bun test

test-coverage:
	docker compose run --rm app bun test --coverage

lint:
	docker compose run --rm app bun eslint ./src ./test

lint-fix:
	docker compose run --rm app bun eslint --fix -- ./src ./test

pre-commit:
	make typecheck
	make test
	make lint

clean:
	@rm -rf ./build ./reports ./coverage

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  install          - Install app dependencies"
	@echo "  start            - Run app"
	@echo "  typecheck        - Typecheck entire project along with tests"
	@echo "  test             - Test app"
	@echo "  test-coverage    - Test app & generate code coverage"
	@echo "  lint             - Lint entire project along with tests"
	@echo "  lint-fix         - Lint & fix entire project along with tests"
	@echo "  precommit        - Run tc + test + lint"
	@echo "  clean            - Clean up generated files"
	@echo "  help             - Show this help message"
	@echo ""

.PHONY: install start tc test test-coverage lint lint-fix precommit clean help

SHELL := /bin/bash
.DEFAULT_GOAL := help 

help: ## Show this help
	@echo Dependencies: go yarn
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install application dependencies
	@go mod download
	@cd mirror && yarn

build: ## Build the application in debug mode
	cd mirror && yarn build
	go build -v

prod: ## Build the application in production mode
	cd mirror && yarn build
	go build -ldflags="-s -w" -tags prod
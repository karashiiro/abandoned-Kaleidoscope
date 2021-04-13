SHELL := /bin/bash
.DEFAULT_GOAL := help 

WEBVIEW2LOADER_DLL = https://raw.githubusercontent.com/webview/webview_csharp/master/libs/WebView2Loader.dll
WEBVIEW_DLL = https://raw.githubusercontent.com/webview/webview_csharp/master/libs/webview.dll

help: ## Show this help
	@echo Dependencies: go yarn [upx]
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install application dependencies
	@go mod download
	@cd mirror && yarn

dll: ## Download the Windows DLLs from webview/webview_csharp
	curl -O $(WEBVIEW2LOADER_DLL) -O $(WEBVIEW_DLL)

build: ## Build the application in debug mode
	@cd mirror && yarn && yarn prettier --write . && yarn build
	@go build -v
	@make dll

prod: ## Build the application in production mode (requires UPX)
	@cd mirror && yarn && yarn prettier --write . && yarn build
	@go build -ldflags="-s -w -H windowsgui" -tags prod
	@make dll
	@upx Kaleidoscope.exe webview.dll WebView2Loader.dll
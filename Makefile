## up: starts all containers in the background without forcing build
build:
	@echo "Building site..."
	ng build --optimization=true
  
	@echo "Finished started!"

## up_build: stops docker-compose (if running), builds all projects and starts docker compose
deploy:
	@echo "Deploy hosting"
	firebase deploy --only hosting

## up_build: stops docker-compose (if running), builds all projects and starts docker compose
functions:
	@echo "Deploy functions"
	firebase deploy --only functions


## up_build: stops docker-compose (if running), builds all projects and starts docker compose
start:
	@echo "start web app"
	pnpm run start


## up_build: stops docker-compose (if running), builds all projects and starts docker compose
add:
	@echo "push to git"
	git add .
	@echo "update"
	git commit -m 'update repository'
	@echo "push"
	git push origin main

## up_build: stops docker-compose (if running), builds all projects and starts docker compose
push:
	@echo "push"
	git push origin main

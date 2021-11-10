build:
	docker build -t safety-vision-platform_ui-local:latest .

setup:
	docker build -t safety-vision-platform_ui-local:latest .
	docker create -ti --name builder safety-vision-platform_ui-local bash
	docker cp builder:/code/build ./
	docker cp builder:/code/node_modules ./
	docker rm -f builder

up:
	docker-compose up

down:
	docker-compose down

uibash:
	docker-compose exec ui /bin/bash

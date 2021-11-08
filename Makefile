build:
	docker build -t safety-vision-platform_ui-local:latest .

up:
	docker-compose up

down:
	docker-compose down

uibash:
	docker-compose exec ui /bin/bash

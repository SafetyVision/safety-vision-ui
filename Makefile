build:
	docker build -t safety-vision-platform_ui-local:latest .

up:
	docker-compose up
	docker-compose exec ui npm start

down:
	docker-compose down

uibash:
	docker-compose exec ui /bin/bash

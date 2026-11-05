up:
	docker-compose up --build -d

exec:
	docker compose run --rm app sh

down:
	docker-compose down

restart: down up

clean: down
	docker compose down -v --rmi all --remove-orphans

re: clean up

status:
	docker-compose ps
	@echo "\n\n"
	docker-compose volumes
	@echo "\n\n"
	docker-compose images

logs:
	docker-compose logs -f --tail:120

help:
	@echo "List of docker commands: (dev only)"
	@echo "make up"
	@echo "make down"
	@echo "make restart"
	@echo "make clean"
	@echo "make re"
	@echo "make status"
	@echo "make logs"


.PHONY: up down restart logs status clean help mongo backend frontend re certs

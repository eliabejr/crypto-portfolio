.PHONY: test test-unit test-integration test-cov test-watch

test:
	docker-compose exec backend pytest

test-unit:
	docker-compose exec backend pytest -m unit

test-integration:
	docker-compose exec backend pytest -m integration

test-cov:
	docker-compose exec backend pytest --cov=apps --cov-report=html --cov-report=term-missing

test-watch:
	docker-compose exec backend ptw --runner "pytest -x"


## Crypto Portfolio Backend

### Execução Local

- Instale as dependências com Poetry
- Rode as migrations
- Fun!

```bash
poetry install
python manage.py migrate
python manage.py runserver
```

### Execução com Docker

```bash
docker-compose up
```

### Rodando Testes

#### Com Docker (Recomendado)

```bash
# Todos os testes
docker-compose exec backend pytest

# Apenas testes unitários
docker-compose exec backend pytest -m unit

# Apenas testes de integração
docker-compose exec backend pytest -m integration

# Com coverage
docker-compose exec backend pytest --cov=apps --cov-report=html
```

#### Com Makefile

```bash
make test
make test-unit
make test-integration
make test-cov
```

#### Localmente

```bash
poetry install
poetry run pytest
```

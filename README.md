# Crypto Portfolio

Aplicação para gerenciar portfólio de criptoativos com descoberta de ativos, favoritos e acompanhamento de posições.

## Pré-requisitos

Para executar com Docker (recomendado):
- Docker e Docker Compose instalados

Para execução local:
- Python 3.12+ e Poetry
- Node.js 18+ e pnpm
- PostgreSQL 16+

## Executando o Projeto

### Método 1: Docker Compose

A forma mais simples de rodar o projeto:

```bash
docker-compose up
```

Isso sobe o banco de dados PostgreSQL e o backend Django. O frontend precisa ser executado separadamente (veja abaixo).

Para rodar em background:
```bash
docker-compose up -d
```

Para parar os serviços:
```bash
docker-compose down
```

### Método 2: Execução Local

#### Backend

1. Instale as dependências com Poetry:
```bash
cd backend
poetry install
```

2. Configure as variáveis de ambiente (opcional, tem valores padrão):
```bash
export DATABASE_URL="postgres://postgres:postgres@localhost:5432/crypto_portfolio"
export DJANGO_SETTINGS_MODULE="config.settings"
```

3. Rode as migrations:
```bash
poetry run python manage.py migrate
```

4. Inicie o servidor:
```bash
poetry run python manage.py runserver
```

O backend estará disponível em `http://localhost:8000`

#### Frontend

1. Instale as dependências:
```bash
cd frontend
pnpm install
```

2. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```

O frontend estará disponível em `http://localhost:7240`

## Acessando os Serviços

Após iniciar os serviços:

- **Frontend**: http://localhost:7240
- **Backend API**: http://localhost:8000/api
- **Documentação da API**: http://localhost:8000/api/docs
- **Admin Django**: http://localhost:8000/admin

## Comandos Úteis

### Backend

Rodar migrations:
```bash
# Com Docker
docker-compose exec backend python manage.py migrate

# Local
cd backend && poetry run python manage.py migrate
```

Criar superusuário:
```bash
# Com Docker
docker-compose exec backend python manage.py createsuperuser

# Local
cd backend && poetry run python manage.py createsuperuser
```

Rodar testes:
```bash
# Com Docker
docker-compose exec backend pytest

# Local
cd backend && make test
```


### Frontend

Build para produção:
```bash
cd frontend
pnpm build
```

Preview do build:
```bash
pnpm preview
```

Rodar testes:
```bash
pnpm test
```

Lint e formatação:
```bash
pnpm lint
pnpm format
```

## Tecnologias

**Backend:**
- Django 5.0
- Django Ninja (API REST)
- PostgreSQL
- Poetry (gerenciamento de dependências)

**Frontend:**
- Vue 3 (Composition API)
- TypeScript
- Vite
- Tailwind CSS v4
- pnpm

## Decisões

Escolhi Tailwind CSS v4 como solução de estilização por facilitar a transição de desenvolvedores que vêm do React, oferecendo uma abordagem utility-first familiar, e por não possuir o mesmo nível de acoplamento presente em frameworks como o Quasar, com o qual já tive experiência. Além da produtividade no desenvolvimento, o Tailwind oferece performance superior com bundle size menor, purge automático de classes não utilizadas e zero JavaScript no bundle final para estilos, mantendo total flexibilidade para criar um design system próprio.

A arquitetura do projeto está organizada por domínio, separando claramente componentes de UI base (agnósticos do negócio) de componentes de domínio específicos (como CryptoCard e Layout) e views que compõem as páginas. Esta estrutura facilita o desenvolvimento de novas features de forma isolada e acelera o ramp-up de novos desenvolvedores, que encontram uma organização clara e intuitiva do código. Para gerenciamento de estado e data fetching, desenvolvemos composables próprios (useFetch, useInfiniteList, useDebounce) em vez de bibliotecas prontas, garantindo controle total e simplicidade adequada ao escopo do projeto.

Criei um adapter customizado do Axios para centralizar as chamadas HTTP, preparando o código para melhorias futuras como cache invalidation, refetch automático e outras otimizações de performance sem necessidade de refatoração em massa. Durante o desenvolvimento inicial, implementei um service mock que simula chamadas de API com delay realista, permitindo desenvolvimento paralelo do frontend independente do backend, com estrutura de dados compatível para facilitar a migração quando a API real estiver disponível.

No backend, optei pelo Django Ninja para aproximar a sintaxe do NestJs a nível de controladores, facilitando a escrita de endpoints REST. Utilizei Poetry para gerenciar os pacotes de maneira mais eficiente, garantindo isolamento de dependências e reprodutibilidade entre ambientes. Escolhi PostgreSQL como banco de dados pela facilidade de configuração e pela robustez necessária para gerenciar as relações entre ativos, favoritos e portfólio.

## Débito Técnico

Atualmente, o sistema não possui autenticação, tampouco controle de acesso e segmentação de portfólio por usuário. Em versões futuras, podemos integrar com alguma API externa para implementar essas funcionalidades, garantindo que cada usuário tenha acesso apenas aos seus próprios dados de portfólio e favoritos.

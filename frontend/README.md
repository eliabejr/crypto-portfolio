# Crypto Portfolio - Frontend

Aplicativo para gerenciar portfólio de criptoativos com descoberta, favoritos e acompanhamento de posições.

## Tecnologias

- Vue 3 (Composition API + `<script setup>`)
- TypeScript
- Vite
- Vue Router
- Tailwind CSS v4

## Princípios de UI

- **Data-driven UI**: Telas refletem estado da API
- **Single source of truth**: URL representa busca, filtros e paginação
- **Feedback explícito**: Loading, erro, vazio e fim de lista
- **Componentização por domínio**: Organização modular por feature
- **Sem fluxo de autenticação**: Usuário único

## Mapa de Telas

```
/
├── Assets (Home)
│   ├── Asset Detail
│   └── Add to Portfolio
│
├── Portfolio
│   └── Portfolio Item Detail (opcional)
│
└── Favorites
```

## Rotas

- `/` → Assets (Home) - Listagem infinita com busca
- `/assets/:id` → Asset Detail - Detalhes e ações do ativo
- `/portfolio` → Portfolio - Visão consolidada das posições
- `/favorites` → Favorites - Acesso rápido a ativos marcados

## Estrutura de Pastas

```
src/
├── components/
│   ├── layout/          # Layout global (AppHeader, AppContainer)
│   └── ui/              # Componentes base reutilizáveis
│       ├── Button.vue
│       ├── Input.vue
│       ├── Loader.vue
│       ├── Skeleton.vue
│       ├── EmptyState.vue
│       └── ErrorState.vue
│
├── modules/              # Organização por domínio
│   ├── assets/
│   │   ├── pages/
│   │   │   ├── AssetsPage.vue
│   │   │   └── AssetDetailPage.vue
│   │   ├── components/
│   │   │   ├── SearchInput.vue
│   │   │   ├── AssetCard.vue
│   │   │   ├── AssetHeader.vue
│   │   │   ├── AssetInfo.vue
│   │   │   ├── FavoriteButton.vue
│   │   │   ├── AddToPortfolioForm.vue
│   │   │   ├── BackButton.vue
│   │   │   └── InfiniteScrollContainer.vue
│   │   ├── api/
│   │   │   └── assets.api.ts
│   │   └── types.ts
│   │
│   ├── portfolio/
│   │   ├── pages/
│   │   │   └── PortfolioPage.vue
│   │   ├── components/
│   │   │   ├── PortfolioSummary.vue
│   │   │   └── PortfolioItemCard.vue
│   │   ├── api/
│   │   │   └── portfolio.api.ts
│   │   └── types.ts
│   │
│   └── favorites/
│       ├── pages/
│       │   └── FavoritesPage.vue
│       ├── api/
│       │   └── favorites.api.ts
│       └── types.ts
│
├── composables/          # Lógica reutilizável
│   ├── useDebounce.ts
│   ├── useInfiniteList.ts
│   ├── useInfiniteListUrl.ts  # URL-driven infinite list
│   └── useInfiniteScroll.ts
│
├── services/             # Serviços de API
│   ├── http.ts          # HTTP client wrapper
│   ├── cryptoService.ts # Mock service (fallback)
│   └── mockData.ts
│
├── router/               # Configuração de rotas
│   └── index.ts
│
└── types/                # Tipos TypeScript globais
```

## Estado via URL (Assets)

A página de Assets usa a URL como single source of truth:

- **Query params:**
  - `q` (string): Termo de busca
  - `page` (number): Página atual carregada

- **Comportamento:**
  - Alterar `q`: atualiza URL, reseta lista e reinicia paginação
  - Carregar mais: incrementa `page` na URL (mantém `q`)
  - Navegação/refresh: estado preservado via URL

## Estados de UI

Cada tela gerencia explicitamente:

| Estado          | Comportamento                    |
| --------------- | -------------------------------- |
| Loading inicial | Skeletons                        |
| Paginação       | Loader no final                  |
| Erro            | Mensagem + botão Retry           |
| Lista vazia     | Mensagem contextual              |
| Fim da lista    | Indicador visual                 |

## API Layer

A camada de API usa adapters que tentam a API real primeiro e fazem fallback para mock service:

- `modules/*/api/*.api.ts`: Adapters por módulo
- `services/http.ts`: Wrapper HTTP com tratamento de erros
- Fallback automático para `cryptoService` quando API real não disponível

## Scripts

```bash
# Desenvolvimento
pnpm dev

# Build
pnpm build

# Preview do build
pnpm preview

# Lint
pnpm lint

# Format
pnpm format
```

## Convenções

- **Componentes**: `<script setup>` + TypeScript
- **Estado**: Preferir estado local por rota, sincronizado via router
- **Race conditions**: Tratamento via request tokens nos composables
- **Navegação**: Sem reload, estado preservado quando possível

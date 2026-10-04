import type { Id, PageParams } from '../api'

// One place for every cache key, so mutations can invalidate exactly what they change.
// Keys are hierarchical: invalidating ['games'] also refreshes ['games', 'detail', 3].
export const queryKeys = {
  games: {
    all: ['games'] as const,
    list: () => ['games', 'list'] as const,
    detail: (id: Id) => ['games', 'detail', id] as const,
  },
  pokedexes: {
    all: ['pokedexes'] as const,
    list: () => ['pokedexes', 'list'] as const,
    detail: (id: Id) => ['pokedexes', 'detail', id] as const,
    games: (id: Id) => ['pokedexes', 'detail', id, 'games'] as const,
  },
  moves: {
    all: ['moves'] as const,
    page: (params: PageParams) => ['moves', 'page', params] as const,
    detail: (id: Id) => ['moves', 'detail', id] as const,
  },
  characters: {
    all: ['characters'] as const,
    list: () => ['characters', 'list'] as const,
    page: (params: PageParams) => ['characters', 'page', params] as const,
    detail: (id: Id) => ['characters', 'detail', id] as const,
    games: (id: Id) => ['characters', 'detail', id, 'games'] as const,
    moves: (id: Id) => ['characters', 'detail', id, 'moves'] as const,
  },
}

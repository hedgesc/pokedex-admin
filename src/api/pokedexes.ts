import { request } from './http'
import type { ApiMessage, Game, Id, Pokedex, PokedexInput } from './types'

// The API calls Pokédexes "game groups".
const base = 'game-groups'

export const pokedexesApi = {
  list: () => request<Pokedex[]>(base),
  get: (id: Id) => request<Pokedex>(`${base}/${id}`),
  create: (pokedex: PokedexInput) => request<ApiMessage>(base, { method: 'POST', body: pokedex }),
  update: (id: Id, pokedex: PokedexInput) =>
    request<ApiMessage>(`${base}/${id}`, { method: 'PUT', body: pokedex }),
  remove: (id: Id) => request<ApiMessage>(`${base}/${id}`, { method: 'DELETE' }),

  listGames: (id: Id) => request<Game[]>(`${base}/${id}/games`),
  addGame: (id: Id, game: Game) =>
    request<ApiMessage>(`${base}/${id}/games`, { method: 'POST', body: game }),
  removeGame: (id: Id, gameId: Id) =>
    request<ApiMessage>(`${base}/${id}/games/${gameId}`, { method: 'DELETE' }),
}

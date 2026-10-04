import { request } from './http'
import type { ApiMessage, Game, GameInput, Id } from './types'

const base = 'games'

export const gamesApi = {
  list: () => request<Game[]>(base),
  get: (id: Id) => request<Game>(`${base}/${id}`),
  create: (game: GameInput) => request<ApiMessage>(base, { method: 'POST', body: game }),
  update: (id: Id, game: GameInput) =>
    request<ApiMessage>(`${base}/${id}`, { method: 'PUT', body: game }),
  remove: (id: Id) => request<ApiMessage>(`${base}/${id}`, { method: 'DELETE' }),
}

import { request } from './http'
import type { ApiMessage, Id, Move, MoveInput, Page, PageParams } from './types'

const base = 'moves'

export const movesApi = {
  /** One page of moves. Pass a large `limit` to get them all. */
  listPage: (params: PageParams) => request<Page<Move>>(base, { query: { ...params } }),
  get: (id: Id) => request<Move>(`${base}/${id}`),
  create: (move: MoveInput) => request<ApiMessage>(base, { method: 'POST', body: move }),
  update: (id: Id, move: MoveInput) =>
    request<ApiMessage>(`${base}/${id}`, { method: 'PUT', body: move }),
  remove: (id: Id) => request<ApiMessage>(`${base}/${id}`, { method: 'DELETE' }),
}

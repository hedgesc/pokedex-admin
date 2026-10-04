import { request } from './http'
import type { ApiMessage, Character, CharacterInput, Id, Page, PageParams } from './types'

const base = 'characters'

export const charactersApi = {
  /** Every character. Without paging params the API returns a plain array. */
  list: () => request<Character[]>(base),
  listPage: (params: PageParams) => request<Page<Character>>(base, { query: { ...params } }),
  get: (id: Id) => request<Character>(`${base}/${id}`),
  create: (character: CharacterInput) =>
    request<ApiMessage>(base, { method: 'POST', body: character }),
  update: (id: Id, character: CharacterInput) =>
    request<ApiMessage>(`${base}/${id}`, { method: 'PUT', body: character }),
  remove: (id: Id) => request<ApiMessage>(`${base}/${id}`, { method: 'DELETE' }),
}

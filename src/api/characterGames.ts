import { request } from './http'
import type { ApiMessage, CharacterGame, CharacterGameInput, Id } from './types'

const base = (characterId: Id) => `characters/${characterId}/games`

export const characterGamesApi = {
  list: (characterId: Id) => request<CharacterGame[]>(base(characterId)),
  /** Resolves to the new character_game_id. */
  create: (characterId: Id, input: CharacterGameInput) =>
    request<Id>(base(characterId), { method: 'POST', body: input }),
  update: (characterId: Id, gameId: Id, input: CharacterGameInput) =>
    request<ApiMessage>(`${base(characterId)}/${gameId}`, { method: 'PUT', body: input }),
  remove: (characterId: Id, gameId: Id) =>
    request<ApiMessage>(`${base(characterId)}/${gameId}`, { method: 'DELETE' }),
}

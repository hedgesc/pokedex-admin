import { request } from './http'
import type { ApiMessage, CharacterMove, Id } from './types'

// Replaces both legacy/src/apis/characterMoves.js and the unused character_moves.js.
const base = (characterId: Id) => `characters/${characterId}/moves`

export const characterMovesApi = {
  list: (characterId: Id) => request<CharacterMove[]>(base(characterId)),
  /** Only `is_suggested` is changed by the app. */
  setSuggested: (characterMoveId: Id, isSuggested: boolean) =>
    request<ApiMessage>(`character-moves/${characterMoveId}`, {
      method: 'PUT',
      body: { is_suggested: isSuggested },
    }),
}

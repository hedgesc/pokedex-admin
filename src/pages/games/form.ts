import type { Game, GameInput } from '../../api'
import type { Region } from '../../constants/regions'

export type GameFormValues = {
  generation: string
  name_id: string
  name: string
  regions: Region[]
}

export const emptyGameForm = (): GameFormValues => ({
  generation: '',
  name_id: '',
  name: '',
  regions: [],
})

export function gameToForm(game: Game): GameFormValues {
  return {
    generation: String(game.generation ?? ''),
    name_id: game.name_id,
    name: game.name,
    regions: Array.isArray(game.regions) ? [...game.regions] : [],
  }
}

export function formToInput(values: GameFormValues): GameInput {
  return {
    generation: Number(values.generation),
    name_id: values.name_id,
    name: values.name,
    regions: values.regions,
  }
}

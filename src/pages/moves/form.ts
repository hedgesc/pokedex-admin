import type { Move, MoveInput } from '../../api'
import type { CharacterType } from '../../constants/characterTypes'
import type { MoveCategory } from '../../constants/moveCategories'

export type MoveFormValues = {
  name: string
  name_id: string
  generation: string
  power: string
  accuracy: string
  pp: string
  type: string
  category: string
}

export const emptyMoveForm = (): MoveFormValues => ({
  name: '',
  name_id: '',
  generation: '',
  power: '',
  accuracy: '',
  pp: '',
  type: '',
  category: '',
})

function optionalNumber(value: string): number | null {
  return value.trim() === '' ? null : Number(value)
}

export function moveToForm(move: Move): MoveFormValues {
  return {
    name: move.name,
    name_id: move.name_id,
    generation: String(move.generation ?? ''),
    power: move.power == null ? '' : String(move.power),
    accuracy: move.accuracy == null ? '' : String(move.accuracy),
    pp: move.pp == null ? '' : String(move.pp),
    type: move.type,
    category: move.category,
  }
}

export function formToInput(values: MoveFormValues): MoveInput {
  return {
    name: values.name,
    name_id: values.name_id,
    generation: Number(values.generation),
    power: optionalNumber(values.power),
    accuracy: optionalNumber(values.accuracy),
    pp: optionalNumber(values.pp),
    type: values.type as CharacterType,
    category: values.category as MoveCategory,
  }
}

import type { Pokedex, PokedexInput } from '../../api'

export type PokedexFormValues = {
  name_id: string
  name: string
  alternate_name: string
  generation: string
}

export const emptyPokedexForm = (): PokedexFormValues => ({
  name_id: '',
  name: '',
  alternate_name: '',
  generation: '',
})

export function pokedexToForm(pokedex: Pokedex): PokedexFormValues {
  return {
    name_id: pokedex.name_id,
    name: pokedex.name,
    alternate_name: pokedex.alternate_name ?? '',
    generation: pokedex.generation == null ? '' : String(pokedex.generation),
  }
}

export function formToInput(values: PokedexFormValues): PokedexInput {
  return {
    name_id: values.name_id,
    name: values.name,
    alternate_name: values.alternate_name.trim() === '' ? null : values.alternate_name,
    generation: values.generation.trim() === '' ? null : Number(values.generation),
  }
}

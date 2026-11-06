import type { Character, CharacterInput, Id } from '../../api'
import type { CharacterType } from '../../constants/characterTypes'

export type CharacterFormValues = {
  character_id: string
  name: string
  name_id: string
  generation: string
  hp: string
  attack: string
  defense: string
  special_attack: string
  special_defense: string
  speed: string
  total: string
  image_url: string
  evolves_from_id: string
  types: CharacterType[]
}

export const emptyCharacterForm = (): CharacterFormValues => ({
  character_id: '',
  name: '',
  name_id: '',
  generation: '',
  hp: '',
  attack: '',
  defense: '',
  special_attack: '',
  special_defense: '',
  speed: '',
  total: '',
  image_url: '',
  evolves_from_id: '',
  types: [],
})

function num(value: string): number {
  return value.trim() === '' ? 0 : Number(value)
}

export function characterToForm(character: Character): CharacterFormValues {
  return {
    character_id: String(character.character_id),
    name: character.name,
    name_id: character.name_id,
    generation: String(character.generation ?? ''),
    hp: String(character.hp ?? ''),
    attack: String(character.attack ?? ''),
    defense: String(character.defense ?? ''),
    special_attack: String(character.special_attack ?? ''),
    special_defense: String(character.special_defense ?? ''),
    speed: String(character.speed ?? ''),
    total: String(character.total ?? ''),
    image_url: character.image_url ?? '',
    evolves_from_id: character.evolves_from_id == null ? '' : String(character.evolves_from_id),
    types: Array.isArray(character.types) ? [...character.types] : [],
  }
}

export function formToInput(values: CharacterFormValues): CharacterInput {
  return {
    name: values.name,
    name_id: values.name_id,
    generation: num(values.generation),
    hp: num(values.hp),
    attack: num(values.attack),
    defense: num(values.defense),
    special_attack: num(values.special_attack),
    special_defense: num(values.special_defense),
    speed: num(values.speed),
    total: num(values.total),
    image_url: values.image_url.trim() === '' ? null : values.image_url,
    evolves_from_id: values.evolves_from_id === '' ? null : Number(values.evolves_from_id),
    types: values.types,
  }
}

/** Create can send a chosen id. Edit keeps the id in the URL, so it is left off. */
export function formToCreate(values: CharacterFormValues): CharacterInput & { character_id?: Id } {
  const input = formToInput(values)
  if (values.character_id.trim() === '') return input
  return { ...input, character_id: Number(values.character_id) }
}

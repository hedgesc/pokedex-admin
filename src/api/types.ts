// Shapes of the REST API's resources. These are inferred from how the Vue app
// (legacy/src) reads and writes them; the API has no published schema.
import type { CharacterType } from '../constants/characterTypes'
import type { MoveCategory } from '../constants/moveCategories'
import type { Region } from '../constants/regions'

export type Id = number

/** Create, update and delete calls answer with a human-readable message. */
export type ApiMessage = string

export interface Page<T> {
  items: T[]
  total_count: number
}

export interface PageParams {
  limit: number
  offset: number
}

export interface Game {
  game_id: Id
  name_id: string
  name: string
  alternate_name?: string | null
  generation: number
  regions: Region[]
}

/** The API calls these "game groups"; the app calls them Pokédexes. */
export interface Pokedex {
  game_group_id: Id
  name_id: string
  name: string
  alternate_name?: string | null
  generation?: number | null
}

export interface Move {
  move_id: Id
  name_id: string
  name: string
  generation: number
  type: CharacterType
  category: MoveCategory
  power: number | null
  accuracy: number | null
  pp: number | null
}

export interface Character {
  character_id: Id
  name_id: string
  name: string
  generation: number
  types: CharacterType[]
  evolves_from_id: Id | null
  image_url: string | null
  hp: number
  attack: number
  defense: number
  special_attack: number
  special_defense: number
  speed: number
  total: number
}

/** A character's appearance in a game. */
export interface CharacterGame {
  character_game_id: Id
  character_id: Id
  game_id: Id
  /** The game's name. */
  name: string
  generation: number
  /** The character's number in that game's Pokédex. */
  game_character_id: number | null
}

/** A move a character can learn, joined with the move's details. */
export interface CharacterMove {
  character_move_id: Id
  character_id: Id
  move_id: Id
  name: string
  generation: number
  type: CharacterType
  power: number | null
  accuracy: number | null
  is_suggested: boolean
}

export type GameInput = Omit<Game, 'game_id'>
export type PokedexInput = Omit<Pokedex, 'game_group_id'>
export type MoveInput = Omit<Move, 'move_id'>
export type CharacterInput = Omit<Character, 'character_id'>
export type CharacterGameInput = Pick<CharacterGame, 'game_id' | 'generation' | 'game_character_id'>

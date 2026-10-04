export const CHARACTER_TYPES = [
  'Fire',
  'Grass',
  'Psychic',
  'Rock',
  'Normal',
  'Ghost',
  'Dragon',
  'Dark',
  'Fairy',
  'Steel',
  'Poison',
  'Water',
  'Sham',
  'Electric',
  'Flying',
  'Ground',
  'Bug',
  'Fighting',
  'Ice',
] as const

export type CharacterType = (typeof CHARACTER_TYPES)[number]

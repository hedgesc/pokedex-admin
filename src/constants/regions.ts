export const REGIONS = [
  'Mock',
  'Fake',
  'Sinnoh',
  'Kalos',
  'Galar',
  'Unova',
  'Hoenn',
  'Johto',
  'Kanto',
  'Alola',
] as const

export type Region = (typeof REGIONS)[number]

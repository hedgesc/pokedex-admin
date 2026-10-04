export const MOVE_CATEGORIES = ['status', 'special', 'physical'] as const

export type MoveCategory = (typeof MOVE_CATEGORIES)[number]

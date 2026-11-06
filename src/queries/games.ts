import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { gamesApi, type GameInput, type Id } from '../api'
import { queryKeys } from './keys'

export const useGames = () => useQuery({ queryKey: queryKeys.games.list(), queryFn: gamesApi.list })

export const useGame = (id: Id) =>
  useQuery({ queryKey: queryKeys.games.detail(id), queryFn: () => gamesApi.get(id) })

export function useCreateGame() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (game: GameInput) => gamesApi.create(game),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.games.all }),
  })
}

export function useUpdateGame(id: Id) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (game: GameInput) => gamesApi.update(id, game),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.games.all }),
  })
}

export function useDeleteGame() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: Id) => gamesApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.games.all }),
  })
}

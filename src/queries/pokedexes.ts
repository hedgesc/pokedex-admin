import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { pokedexesApi, type Game, type Id, type PokedexInput } from '../api'
import { queryKeys } from './keys'

export const usePokedexes = () =>
  useQuery({ queryKey: queryKeys.pokedexes.list(), queryFn: pokedexesApi.list })

export const usePokedex = (id: Id) =>
  useQuery({ queryKey: queryKeys.pokedexes.detail(id), queryFn: () => pokedexesApi.get(id) })

export const usePokedexGames = (id: Id) =>
  useQuery({ queryKey: queryKeys.pokedexes.games(id), queryFn: () => pokedexesApi.listGames(id) })

export function useCreatePokedex() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (pokedex: PokedexInput) => pokedexesApi.create(pokedex),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.pokedexes.all }),
  })
}

export function useUpdatePokedex(id: Id) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (pokedex: PokedexInput) => pokedexesApi.update(id, pokedex),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.pokedexes.all }),
  })
}

export function useDeletePokedex() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: Id) => pokedexesApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.pokedexes.all }),
  })
}

export function useAddPokedexGame(id: Id) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (game: Game) => pokedexesApi.addGame(id, game),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.pokedexes.games(id) }),
  })
}

export function useRemovePokedexGame(id: Id) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (gameId: Id) => pokedexesApi.removeGame(id, gameId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.pokedexes.games(id) }),
  })
}

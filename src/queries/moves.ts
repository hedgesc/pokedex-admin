import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { movesApi, type Id, type MoveInput, type PageParams } from '../api'
import { queryKeys } from './keys'

export const useMovesPage = (params: PageParams) =>
  useQuery({
    queryKey: queryKeys.moves.page(params),
    queryFn: () => movesApi.listPage(params),
    // Keep showing the current page while the next one loads.
    placeholderData: keepPreviousData,
  })

export const useMove = (id: Id) =>
  useQuery({ queryKey: queryKeys.moves.detail(id), queryFn: () => movesApi.get(id) })

export function useCreateMove() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (move: MoveInput) => movesApi.create(move),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.moves.all }),
  })
}

export function useUpdateMove(id: Id) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (move: MoveInput) => movesApi.update(id, move),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.moves.all }),
  })
}

export function useDeleteMove() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: Id) => movesApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.moves.all }),
  })
}

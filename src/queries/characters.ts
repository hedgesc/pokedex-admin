import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  characterGamesApi,
  characterMovesApi,
  charactersApi,
  type CharacterGameInput,
  type CharacterInput,
  type Id,
  type PageParams,
} from '../api'
import { queryKeys } from './keys'

export const useCharacters = () =>
  useQuery({ queryKey: queryKeys.characters.list(), queryFn: charactersApi.list })

export const useCharactersPage = (params: PageParams) =>
  useQuery({
    queryKey: queryKeys.characters.page(params),
    queryFn: () => charactersApi.listPage(params),
    placeholderData: keepPreviousData,
  })

export const useCharacter = (id: Id) =>
  useQuery({ queryKey: queryKeys.characters.detail(id), queryFn: () => charactersApi.get(id) })

export function useCreateCharacter() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (character: CharacterInput & { character_id?: Id }) =>
      charactersApi.create(character),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.characters.all }),
  })
}

export function useUpdateCharacter(id: Id) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (character: CharacterInput) => charactersApi.update(id, character),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.characters.all }),
  })
}

export function useDeleteCharacter() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: Id) => charactersApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.characters.all }),
  })
}

// Games a character appears in

export const useCharacterGames = (characterId: Id) =>
  useQuery({
    queryKey: queryKeys.characters.games(characterId),
    queryFn: () => characterGamesApi.list(characterId),
  })

export function useAddCharacterGame(characterId: Id) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CharacterGameInput) => characterGamesApi.create(characterId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.games(characterId) }),
  })
}

export function useUpdateCharacterGame(characterId: Id) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ gameId, input }: { gameId: Id; input: CharacterGameInput }) =>
      characterGamesApi.update(characterId, gameId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.games(characterId) }),
  })
}

export function useRemoveCharacterGame(characterId: Id) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (gameId: Id) => characterGamesApi.remove(characterId, gameId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.games(characterId) }),
  })
}

// Moves a character can learn

export const useCharacterMoves = (characterId: Id) =>
  useQuery({
    queryKey: queryKeys.characters.moves(characterId),
    queryFn: () => characterMovesApi.list(characterId),
  })

export function useSetMoveSuggested(characterId: Id) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ characterMoveId, isSuggested }: { characterMoveId: Id; isSuggested: boolean }) =>
      characterMovesApi.setSuggested(characterMoveId, isSuggested),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.characters.moves(characterId) }),
  })
}

import { QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import type { ReactNode } from 'react'
import type { Game } from '../api'
import { createQueryClient } from '../lib/queryClient'
import { api, server } from '../test/server'
import { useCreateGame, useGame, useGames } from './games'

const red: Game = {
  game_id: 1,
  name_id: 'red',
  name: 'Red',
  generation: 1,
  regions: ['Kanto'],
}

// A fresh cache per test, created once so re-renders share it.
function createWrapper() {
  const client = createQueryClient()
  client.setDefaultOptions({ queries: { retry: false } })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
}

describe('game queries', () => {
  it('useGames loads the list', async () => {
    server.use(http.get(api('games'), () => HttpResponse.json([red])))
    const { result } = renderHook(() => useGames(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([red])
  })

  it('useGame exposes API errors', async () => {
    server.use(http.get(api('games/9'), () => HttpResponse.text('Not found', { status: 404 })))
    const { result } = renderHook(() => useGame(9), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe('Not found')
  })

  it('useCreateGame refreshes the list after creating', async () => {
    const games: Game[] = []
    server.use(
      http.get(api('games'), () => HttpResponse.json(games)),
      http.post(api('games'), () => {
        games.push(red)
        return HttpResponse.text('Game created')
      }),
    )
    const { result } = renderHook(() => ({ list: useGames(), create: useCreateGame() }), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.list.data).toEqual([]))

    let message: string | undefined
    await act(async () => {
      message = await result.current.create.mutateAsync(red)
    })

    expect(message).toBe('Game created')
    await waitFor(() => expect(result.current.list.data).toEqual([red]))
  })
})

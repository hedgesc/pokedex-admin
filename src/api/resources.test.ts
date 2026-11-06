import { http, HttpResponse } from 'msw'
import { api, server } from '../test/server'
import { characterGamesApi, characterMovesApi, charactersApi, movesApi, pokedexesApi } from '.'

// The HTTP client is covered in http.test.ts; these check each module calls the right endpoint.
describe('API modules', () => {
  it('pokedexes use the game-groups endpoint', async () => {
    server.use(http.get(api('game-groups/2/games'), () => HttpResponse.json([{ game_id: 5 }])))
    await expect(pokedexesApi.listGames(2)).resolves.toEqual([{ game_id: 5 }])
  })

  it('pages through moves with limit and offset', async () => {
    let query = ''
    server.use(
      http.get(api('moves'), ({ request }) => {
        query = new URL(request.url).search
        return HttpResponse.json({ items: [], total_count: 0 })
      }),
    )
    await movesApi.listPage({ limit: 8, offset: 16 })
    expect(query).toBe('?limit=8&offset=16')
  })

  it('lists all characters without paging params', async () => {
    server.use(
      http.get(api('characters'), ({ request }) =>
        HttpResponse.json(new URL(request.url).search ? 'unexpected query' : []),
      ),
    )
    await expect(charactersApi.list()).resolves.toEqual([])
  })

  it('creates a character game and returns its id', async () => {
    server.use(http.post(api('characters/7/games'), () => HttpResponse.json(42)))
    await expect(
      characterGamesApi.create(7, { game_id: 1, generation: 1, game_character_id: 25 }),
    ).resolves.toBe(42)
  })

  it('updates a character game by game id', async () => {
    server.use(http.put(api('characters/7/games/1'), () => HttpResponse.text('Updated')))
    await expect(
      characterGamesApi.update(7, 1, { game_id: 1, generation: 2, game_character_id: 25 }),
    ).resolves.toBe('Updated')
  })

  it('sets a suggested move through character-moves', async () => {
    let body: unknown
    server.use(
      http.put(api('character-moves/11'), async ({ request }) => {
        body = await request.json()
        return HttpResponse.text('Updated')
      }),
    )
    await characterMovesApi.setSuggested(11, true)
    expect(body).toEqual({ is_suggested: true })
  })
})

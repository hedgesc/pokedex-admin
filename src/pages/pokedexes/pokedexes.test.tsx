import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import type { Game, Pokedex } from '../../api'
import { api, server } from '../../test/server'
import { renderApp } from '../../test/render'

const kanto: Pokedex = {
  game_group_id: 2,
  name_id: 'kanto',
  name: 'Kanto',
  alternate_name: null,
  generation: 1,
}

const red: Game = {
  game_id: 12,
  name_id: 'red',
  name: 'Red',
  generation: 1,
  regions: ['Kanto'],
}

describe('pokedex pages', () => {
  it('opens a pokédex from the list', async () => {
    server.use(http.get(api('game-groups'), () => HttpResponse.json([kanto])))
    const router = renderApp('/pokedex/list')

    await userEvent.click(await screen.findByRole('cell', { name: 'Kanto' }))
    expect(router.state.location.pathname).toBe('/pokedex/edit/2')
  })

  it('shows a list error from the API', async () => {
    server.use(
      http.get(api('game-groups'), () => HttpResponse.text('Unavailable', { status: 500 })),
    )
    renderApp('/pokedex/list')
    expect(await screen.findByRole('alert')).toHaveTextContent('Unavailable')
  })

  it('creates a pokédex and returns to the list', async () => {
    const user = userEvent.setup()
    let body: unknown
    server.use(
      http.get(api('game-groups'), () => HttpResponse.json([])),
      http.post(api('game-groups'), async ({ request }) => {
        body = await request.json()
        return HttpResponse.text('Pokédex created')
      }),
    )
    const router = renderApp('/pokedex/create')

    await user.type(screen.getByLabelText('Name ID'), 'kanto')
    await user.type(screen.getByLabelText('Name'), 'Kanto')
    await user.type(screen.getByLabelText('Generation'), '1')
    await user.click(screen.getByRole('button', { name: 'Create' }))

    expect(await screen.findByText('Pokédex created')).toBeInTheDocument()
    await waitFor(() => expect(router.state.location.pathname).toBe('/pokedex/list'))
    expect(body).toEqual({
      name_id: 'kanto',
      name: 'Kanto',
      alternate_name: null,
      generation: 1,
    })
  })

  it('saves an edit', async () => {
    const user = userEvent.setup()
    let body: unknown
    server.use(
      http.get(api('game-groups/2'), () => HttpResponse.json(kanto)),
      http.get(api('game-groups/2/games'), () => HttpResponse.json([])),
      http.put(api('game-groups/2'), async ({ request }) => {
        body = await request.json()
        return HttpResponse.text('Pokédex saved')
      }),
    )
    renderApp('/pokedex/edit/2')

    const name = await screen.findByLabelText('Name')
    await user.clear(name)
    await user.type(name, 'Kanto Pokédex')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Pokédex saved')).toBeInTheDocument()
    expect(body).toMatchObject({ name: 'Kanto Pokédex', name_id: 'kanto', generation: 1 })
  })

  it('deletes a pokédex after confirmation', async () => {
    const user = userEvent.setup()
    server.use(
      http.get(api('game-groups/2'), () => HttpResponse.json(kanto)),
      http.get(api('game-groups/2/games'), () => HttpResponse.json([])),
      http.get(api('game-groups'), () => HttpResponse.json([])),
      http.delete(api('game-groups/2'), () => HttpResponse.text('Pokédex deleted')),
    )
    const router = renderApp('/pokedex/edit/2')

    await user.click(await screen.findByRole('button', { name: 'Delete' }))
    await user.click(await screen.findByRole('button', { name: 'Yes' }))

    expect(await screen.findByText('Pokédex deleted')).toBeInTheDocument()
    await waitFor(() => expect(router.state.location.pathname).toBe('/pokedex/list'))
  })

  it('adds a game that is not already in the pokédex', async () => {
    const user = userEvent.setup()
    let body: unknown
    server.use(
      http.get(api('games'), () => HttpResponse.json([red])),
      http.get(api('game-groups/2/games'), () => HttpResponse.json([])),
      http.post(api('game-groups/2/games'), async ({ request }) => {
        body = await request.json()
        return HttpResponse.text('Game added')
      }),
    )
    renderApp('/pokedex/edit/2/games')

    await screen.findByRole('option', { name: 'Red' })
    await user.selectOptions(screen.getByRole('combobox', { name: 'Game' }), 'Red')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(await screen.findByText('Game added')).toBeInTheDocument()
    expect(body).toEqual(red)
  })

  it('refuses a game that is already in the pokédex', async () => {
    const user = userEvent.setup()
    server.use(
      http.get(api('games'), () => HttpResponse.json([red])),
      http.get(api('game-groups/2/games'), () => HttpResponse.json([red])),
    )
    renderApp('/pokedex/edit/2/games')

    await screen.findByRole('option', { name: 'Red' })
    await user.selectOptions(screen.getByRole('combobox', { name: 'Game' }), 'Red')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(await screen.findByText('Game 12 has already been added.')).toBeInTheDocument()
  })

  it('removes a game', async () => {
    const user = userEvent.setup()
    let games = [red]
    server.use(
      http.get(api('games'), () => HttpResponse.json([red])),
      http.get(api('game-groups/2/games'), () => HttpResponse.json(games)),
      http.delete(api('game-groups/2/games/12'), () => {
        games = []
        return HttpResponse.text('Game removed')
      }),
    )
    renderApp('/pokedex/edit/2/games')

    await user.click(await screen.findByRole('button', { name: 'Remove Red' }))

    expect(await screen.findByText('Game removed')).toBeInTheDocument()
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'Remove Red' })).not.toBeInTheDocument(),
    )
  })
})

import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import type { Game } from '../../api'
import { api, server } from '../../test/server'
import { renderApp } from '../../test/render'

const red: Game = {
  game_id: 3,
  name_id: 'red',
  name: 'Red',
  generation: 1,
  regions: ['Kanto'],
}

describe('games pages', () => {
  it('opens a game from the list', async () => {
    server.use(http.get(api('games'), () => HttpResponse.json([red])))
    const router = renderApp('/game/list')

    await userEvent.click(await screen.findByRole('cell', { name: 'Red' }))
    expect(router.state.location.pathname).toBe('/game/edit/3')
  })

  it('shows a list error from the API', async () => {
    server.use(http.get(api('games'), () => HttpResponse.text('Unavailable', { status: 500 })))
    renderApp('/game/list')
    expect(await screen.findByRole('alert')).toHaveTextContent('Unavailable')
  })

  it('creates a game and returns to the list', async () => {
    const user = userEvent.setup()
    let body: unknown
    server.use(
      http.get(api('games'), () => HttpResponse.json([])),
      http.post(api('games'), async ({ request }) => {
        body = await request.json()
        return HttpResponse.text('Game created')
      }),
    )
    const router = renderApp('/game/create')

    await user.type(screen.getByLabelText('Generation'), '1')
    await user.type(screen.getByLabelText('Name ID'), 'blue')
    await user.type(screen.getByLabelText('Name'), 'Blue')
    await user.selectOptions(screen.getByLabelText('Regions'), 'Kanto')
    await user.click(screen.getByRole('button', { name: 'Create' }))

    expect(await screen.findByText('Game created')).toBeInTheDocument()
    await waitFor(() => expect(router.state.location.pathname).toBe('/game/list'))
    expect(body).toEqual({
      generation: 1,
      name_id: 'blue',
      name: 'Blue',
      regions: ['Kanto'],
    })
  })

  it('shows an error toast when create fails', async () => {
    const user = userEvent.setup()
    server.use(http.post(api('games'), () => HttpResponse.text('Name taken', { status: 400 })))
    const router = renderApp('/game/create')

    await user.click(screen.getByRole('button', { name: 'Create' }))

    expect(await screen.findByText('Name taken')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/game/create')
  })

  it('saves an edit', async () => {
    const user = userEvent.setup()
    let body: unknown
    server.use(
      http.get(api('games/3'), () => HttpResponse.json(red)),
      http.put(api('games/3'), async ({ request }) => {
        body = await request.json()
        return HttpResponse.text('Game saved')
      }),
    )
    renderApp('/game/edit/3')

    const name = await screen.findByLabelText('Name')
    await user.clear(name)
    await user.type(name, 'Red Version')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Game saved')).toBeInTheDocument()
    expect(body).toMatchObject({ name: 'Red Version', name_id: 'red', regions: ['Kanto'] })
  })

  it('deletes a game after confirmation', async () => {
    const user = userEvent.setup()
    server.use(
      http.get(api('games/3'), () => HttpResponse.json(red)),
      http.get(api('games'), () => HttpResponse.json([])),
      http.delete(api('games/3'), () => HttpResponse.text('Game deleted')),
    )
    const router = renderApp('/game/edit/3')

    await user.click(await screen.findByRole('button', { name: 'Delete' }))
    await user.click(await screen.findByRole('button', { name: 'Yes' }))

    expect(await screen.findByText('Game deleted')).toBeInTheDocument()
    await waitFor(() => expect(router.state.location.pathname).toBe('/game/list'))
  })

  it('keeps the game when delete is cancelled', async () => {
    const user = userEvent.setup()
    server.use(http.get(api('games/3'), () => HttpResponse.json(red)))
    const router = renderApp('/game/edit/3')

    await user.click(await screen.findByRole('button', { name: 'Delete' }))
    await user.click(await screen.findByRole('button', { name: 'No' }))

    expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/game/edit/3')
    expect(screen.getByLabelText('Name')).toHaveValue('Red')
  })
})

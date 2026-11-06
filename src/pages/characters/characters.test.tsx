import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import type { Character, CharacterMove, Page } from '../../api'
import { api, server } from '../../test/server'
import { renderApp } from '../../test/render'

const bulbasaur: Character = {
  character_id: 4,
  name_id: 'bulbasaur',
  name: 'Bulbasaur',
  generation: 1,
  types: ['Grass'],
  evolves_from_id: null,
  image_url: null,
  hp: 45,
  attack: 49,
  defense: 49,
  special_attack: 65,
  special_defense: 65,
  speed: 45,
  total: 318,
}

const ivysaur: Character = { ...bulbasaur, character_id: 5, name_id: 'ivysaur', name: 'Ivysaur' }

function page(items: Character[], total: number): Page<Character> {
  return { items, total_count: total }
}

function move(
  partial: Partial<CharacterMove> & Pick<CharacterMove, 'character_move_id' | 'name'>,
): CharacterMove {
  return {
    character_id: 4,
    move_id: partial.character_move_id,
    generation: 1,
    type: 'Normal',
    power: 40,
    accuracy: 100,
    is_suggested: false,
    ...partial,
  }
}

describe('character pages', () => {
  it('opens a character from the list', async () => {
    server.use(http.get(api('characters'), () => HttpResponse.json(page([bulbasaur], 1))))
    const router = renderApp('/character/list')

    await userEvent.click(await screen.findByRole('cell', { name: 'Bulbasaur' }))
    expect(router.state.location.pathname).toBe('/character/edit/4')
  })

  it('loads the next page', async () => {
    const user = userEvent.setup()
    server.use(
      http.get(api('characters'), ({ request }) => {
        const offset = Number(new URL(request.url).searchParams.get('offset'))
        return HttpResponse.json(page(offset === 0 ? [bulbasaur] : [ivysaur], 10))
      }),
    )
    renderApp('/character/list')

    expect(await screen.findByRole('cell', { name: 'Bulbasaur' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '2' }))
    expect(await screen.findByRole('cell', { name: 'Ivysaur' })).toBeInTheDocument()
  })

  it('shows a list error from the API', async () => {
    server.use(http.get(api('characters'), () => HttpResponse.text('Unavailable', { status: 500 })))
    renderApp('/character/list')
    expect(await screen.findByRole('alert')).toHaveTextContent('Unavailable')
  })

  it('creates a character and returns to the list', async () => {
    const user = userEvent.setup()
    let body: unknown
    server.use(
      http.get(api('characters'), ({ request }) => {
        if (new URL(request.url).searchParams.has('limit')) {
          return HttpResponse.json(page([], 0))
        }
        return HttpResponse.json([bulbasaur])
      }),
      http.post(api('characters'), async ({ request }) => {
        body = await request.json()
        return HttpResponse.text('Character created')
      }),
    )
    const router = renderApp('/character/create')

    await user.type(screen.getByLabelText('Character Id'), '1')
    await user.type(screen.getByLabelText('Name'), 'Bulbasaur')
    await user.type(screen.getByLabelText('Name ID'), 'bulbasaur')
    await user.type(screen.getByLabelText('HP'), '45')
    await screen.findByRole('option', { name: 'Bulbasaur' })
    await user.selectOptions(screen.getByLabelText('Evolves From'), 'Bulbasaur')
    await user.selectOptions(screen.getByLabelText('Types'), 'Grass')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Character created')).toBeInTheDocument()
    await waitFor(() => expect(router.state.location.pathname).toBe('/character/list'))
    expect(body).toMatchObject({
      character_id: 1,
      name: 'Bulbasaur',
      name_id: 'bulbasaur',
      hp: 45,
      evolves_from_id: 4,
      image_url: null,
      types: ['Grass'],
    })
  })

  it('saves an edit', async () => {
    const user = userEvent.setup()
    let body: unknown
    server.use(
      http.get(api('characters/4'), () => HttpResponse.json(bulbasaur)),
      http.get(api('characters'), () => HttpResponse.json([bulbasaur])),
      http.put(api('characters/4'), async ({ request }) => {
        body = await request.json()
        return HttpResponse.text('Character saved')
      }),
    )
    renderApp('/character/edit/4')

    const name = await screen.findByLabelText('Name')
    await user.clear(name)
    await user.type(name, 'Bulbasaur Updated')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Character saved')).toBeInTheDocument()
    expect(body).toMatchObject({ name: 'Bulbasaur Updated', hp: 45, types: ['Grass'] })
  })

  it('deletes a character after confirmation', async () => {
    const user = userEvent.setup()
    server.use(
      http.get(api('characters/4'), () => HttpResponse.json(bulbasaur)),
      http.get(api('characters'), ({ request }) => {
        if (new URL(request.url).searchParams.has('limit')) return HttpResponse.json(page([], 0))
        return HttpResponse.json([bulbasaur])
      }),
      http.delete(api('characters/4'), () => HttpResponse.text('Character deleted')),
    )
    const router = renderApp('/character/edit/4')

    await user.click(await screen.findByRole('button', { name: 'Delete' }))
    await user.click(await screen.findByRole('button', { name: 'Yes' }))

    expect(await screen.findByText('Character deleted')).toBeInTheDocument()
    await waitFor(() => expect(router.state.location.pathname).toBe('/character/list'))
  })

  it('adds a game appearance', async () => {
    const user = userEvent.setup()
    let body: unknown
    server.use(
      http.get(api('characters/4'), () => HttpResponse.json(bulbasaur)),
      http.get(api('games'), () =>
        HttpResponse.json([
          { game_id: 1, name_id: 'red', name: 'Red', generation: 1, regions: ['Kanto'] },
        ]),
      ),
      http.get(api('characters/4/games'), () => HttpResponse.json([])),
      http.post(api('characters/4/games'), async ({ request }) => {
        body = await request.json()
        return HttpResponse.json(9)
      }),
    )
    renderApp('/character/edit/4/games')

    await user.selectOptions(await screen.findByRole('combobox', { name: 'Game' }), 'Red')
    await user.type(screen.getByRole('spinbutton', { name: 'Generation' }), '1')
    await user.type(screen.getByRole('spinbutton', { name: 'Character Id' }), '1')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(await screen.findByText('Game Character 9 created')).toBeInTheDocument()
    expect(body).toEqual({ game_id: 1, generation: 1, game_character_id: 1 })
  })

  it('filters moves by generation and marks one suggested', async () => {
    const user = userEvent.setup()
    let body: unknown
    const tackle = move({ character_move_id: 1, name: 'Tackle', generation: 1 })
    const ember = move({
      character_move_id: 2,
      name: 'Ember',
      generation: 2,
      type: 'Fire',
    })
    server.use(
      http.get(api('characters/4'), () => HttpResponse.json(bulbasaur)),
      http.get(api('characters/4/moves'), () => HttpResponse.json([tackle, ember])),
      http.put(api('character-moves/1'), async ({ request }) => {
        body = await request.json()
        return HttpResponse.text('Updated')
      }),
    )
    renderApp('/character/edit/4/moves')

    expect(await screen.findByText('Tackle')).toBeInTheDocument()
    expect(screen.queryByText('Ember')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '2' }))
    expect(screen.getByText('Ember')).toBeInTheDocument()
    expect(screen.queryByText('Tackle')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('checkbox', { name: 'Suggested Tackle' }))
    await waitFor(() => expect(body).toEqual({ is_suggested: true }))
  })

  it('disables another suggestion once four are chosen', async () => {
    const suggested = [1, 2, 3, 4].map((id) =>
      move({ character_move_id: id, name: `Move ${id}`, is_suggested: true }),
    )
    const extra = move({ character_move_id: 5, name: 'Splash', is_suggested: false })
    server.use(
      http.get(api('characters/4'), () => HttpResponse.json(bulbasaur)),
      http.get(api('characters/4/moves'), () => HttpResponse.json([...suggested, extra])),
    )
    renderApp('/character/edit/4/moves')

    expect(await screen.findByRole('checkbox', { name: 'Suggested Splash' })).toBeDisabled()
    expect(screen.getByRole('checkbox', { name: 'Suggested Move 1' })).toBeEnabled()
  })
})

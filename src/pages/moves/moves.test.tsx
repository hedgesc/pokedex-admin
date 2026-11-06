import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import type { Move, Page } from '../../api'
import { api, server } from '../../test/server'
import { renderApp } from '../../test/render'

const tackle: Move = {
  move_id: 4,
  name_id: 'tackle',
  name: 'Tackle',
  generation: 1,
  type: 'Normal',
  category: 'physical',
  power: 40,
  accuracy: 100,
  pp: 35,
}

const ember: Move = {
  ...tackle,
  move_id: 5,
  name_id: 'ember',
  name: 'Ember',
  type: 'Fire',
  category: 'special',
  power: 40,
}

function page(items: Move[], total: number): Page<Move> {
  return { items, total_count: total }
}

describe('moves pages', () => {
  it('opens a move from the list', async () => {
    server.use(http.get(api('moves'), () => HttpResponse.json(page([tackle], 1))))
    const router = renderApp('/move/list')

    await userEvent.click(await screen.findByRole('cell', { name: 'Tackle' }))
    expect(router.state.location.pathname).toBe('/move/edit/4')
  })

  it('loads the next page', async () => {
    const user = userEvent.setup()
    server.use(
      http.get(api('moves'), ({ request }) => {
        const offset = Number(new URL(request.url).searchParams.get('offset'))
        return HttpResponse.json(page(offset === 0 ? [tackle] : [ember], 16))
      }),
    )
    renderApp('/move/list')

    expect(await screen.findByRole('cell', { name: 'Tackle' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '2' }))
    expect(await screen.findByRole('cell', { name: 'Ember' })).toBeInTheDocument()
  })

  it('shows a list error from the API', async () => {
    server.use(http.get(api('moves'), () => HttpResponse.text('Unavailable', { status: 500 })))
    renderApp('/move/list')
    expect(await screen.findByRole('alert')).toHaveTextContent('Unavailable')
  })

  it('creates a move and returns to the list', async () => {
    const user = userEvent.setup()
    let body: unknown
    server.use(
      http.get(api('moves'), () => HttpResponse.json(page([], 0))),
      http.post(api('moves'), async ({ request }) => {
        body = await request.json()
        return HttpResponse.text('Move created')
      }),
    )
    const router = renderApp('/move/create')

    await user.type(screen.getByLabelText('Name'), 'Tackle')
    await user.type(screen.getByLabelText('Name ID'), 'tackle')
    await user.type(screen.getByLabelText('Generation'), '1')
    await user.type(screen.getByLabelText('Power'), '40')
    await user.selectOptions(screen.getByLabelText('Type'), 'Normal')
    await user.selectOptions(screen.getByLabelText('Category'), 'physical')
    await user.click(screen.getByRole('button', { name: 'Create' }))

    expect(await screen.findByText('Move created')).toBeInTheDocument()
    await waitFor(() => expect(router.state.location.pathname).toBe('/move/list'))
    expect(body).toEqual({
      name: 'Tackle',
      name_id: 'tackle',
      generation: 1,
      power: 40,
      accuracy: null,
      pp: null,
      type: 'Normal',
      category: 'physical',
    })
  })

  it('shows an error toast when create fails', async () => {
    const user = userEvent.setup()
    server.use(http.post(api('moves'), () => HttpResponse.text('Name taken', { status: 400 })))
    const router = renderApp('/move/create')

    await user.click(screen.getByRole('button', { name: 'Create' }))

    expect(await screen.findByText('Name taken')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/move/create')
  })

  it('saves an edit', async () => {
    const user = userEvent.setup()
    let body: unknown
    server.use(
      http.get(api('moves/4'), () => HttpResponse.json(tackle)),
      http.put(api('moves/4'), async ({ request }) => {
        body = await request.json()
        return HttpResponse.text('Move saved')
      }),
    )
    renderApp('/move/edit/4')

    const name = await screen.findByLabelText('Name')
    await user.clear(name)
    await user.type(name, 'Tackle Move')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Move saved')).toBeInTheDocument()
    expect(body).toMatchObject({ name: 'Tackle Move', power: 40, type: 'Normal' })
  })

  it('deletes a move after confirmation', async () => {
    const user = userEvent.setup()
    server.use(
      http.get(api('moves/4'), () => HttpResponse.json(tackle)),
      http.get(api('moves'), () => HttpResponse.json(page([], 0))),
      http.delete(api('moves/4'), () => HttpResponse.text('Move deleted')),
    )
    const router = renderApp('/move/edit/4')

    await user.click(await screen.findByRole('button', { name: 'Delete' }))
    await user.click(await screen.findByRole('button', { name: 'Yes' }))

    expect(await screen.findByText('Move deleted')).toBeInTheDocument()
    await waitFor(() => expect(router.state.location.pathname).toBe('/move/list'))
  })

  it('keeps the move when delete is cancelled', async () => {
    const user = userEvent.setup()
    server.use(http.get(api('moves/4'), () => HttpResponse.json(tackle)))
    const router = renderApp('/move/edit/4')

    await user.click(await screen.findByRole('button', { name: 'Delete' }))
    await user.click(await screen.findByRole('button', { name: 'No' }))

    expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/move/edit/4')
    expect(screen.getByLabelText('Name')).toHaveValue('Tackle')
  })
})

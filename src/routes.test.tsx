import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import type { Game } from './api'
import { api, server } from './test/server'
import { renderApp } from './test/render'

const red: Game = {
  game_id: 12,
  name_id: 'red',
  name: 'Red',
  generation: 1,
  regions: ['Kanto'],
}

beforeEach(() => {
  server.use(
    http.get(api('games'), () => HttpResponse.json([red])),
    http.get(api('games/:id'), () => HttpResponse.json(red)),
  )
})

describe('routes', () => {
  it('renders the home page with links to each section', () => {
    renderApp('/')
    expect(screen.getByRole('heading', { name: 'Pokédex Admin' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveClass('active')
  })

  it.each([
    ['/game/list', 'All Games', 'Games'],
    ['/game/edit/12', 'Editing Game 12', 'Games'],
    ['/game/create', 'Create a Game', 'Games'],
    ['/character/edit/4/moves', 'Character Moves', 'Characters'],
    ['/move/create', 'Create Move', 'Moves'],
    ['/pokedex/edit/2/games', 'Pokédex Games', 'Pokédexes'],
  ])('%s renders "%s" and highlights %s in the navbar', async (path, title, navLabel) => {
    renderApp(path)
    expect(await screen.findByRole('heading', { name: title })).toBeInTheDocument()
    if (path.startsWith('/game/edit')) {
      expect(await screen.findByDisplayValue('Red')).toBeInTheDocument()
    }
    if (path === '/game/list') {
      expect(await screen.findByRole('cell', { name: 'Red' })).toBeInTheDocument()
    }

    const nav = screen.getByRole('navigation', { name: 'Main' })
    const navLinks = Array.from(nav.querySelectorAll('a.nav-link'))
    const active = navLinks.filter((link) => link.classList.contains('active'))
    expect(active.map((link) => link.textContent)).toEqual([navLabel])
  })

  it('shows a not found page for unknown paths', () => {
    renderApp('/nope')
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('navigates from the home page to a section', async () => {
    const router = renderApp('/')
    const main = screen.getByRole('main')
    await userEvent.click(within(main).getByRole('link', { name: 'Moves' }))
    expect(router.state.location.pathname).toBe('/move/list')
  })
})

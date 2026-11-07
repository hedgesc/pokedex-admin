import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import type { Character, Game, Move, Pokedex } from './api'
import { api, server } from './test/server'
import { renderApp } from './test/render'

const red: Game = {
  game_id: 12,
  name_id: 'red',
  name: 'Red',
  generation: 1,
  regions: ['Kanto'],
}

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

const bulbasaur: Character = {
  character_id: 4,
  name_id: 'bulbasaur',
  name: 'Bulbasaur',
  generation: 1,
  types: ['Grass', 'Poison'],
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

const kanto: Pokedex = {
  game_group_id: 2,
  name_id: 'kanto',
  name: 'Kanto',
  alternate_name: null,
  generation: 1,
}

beforeEach(() => {
  server.use(
    http.get(api('games'), () => HttpResponse.json([red])),
    http.get(api('games/:id'), () => HttpResponse.json(red)),
    http.get(api('moves'), () => HttpResponse.json({ items: [tackle], total_count: 1 })),
    http.get(api('moves/:id'), () => HttpResponse.json(tackle)),
    http.get(api('characters'), ({ request }) => {
      const url = new URL(request.url)
      if (url.searchParams.has('limit')) {
        return HttpResponse.json({ items: [bulbasaur], total_count: 1 })
      }
      return HttpResponse.json([bulbasaur])
    }),
    http.get(api('characters/:id'), () => HttpResponse.json(bulbasaur)),
    http.get(api('characters/:id/games'), () => HttpResponse.json([])),
    http.get(api('characters/:id/moves'), () => HttpResponse.json([])),
    http.get(api('game-groups'), () => HttpResponse.json([kanto])),
    http.get(api('game-groups/:id'), () => HttpResponse.json(kanto)),
    http.get(api('game-groups/:id/games'), () => HttpResponse.json([red])),
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
    ['/character/list', 'All Characters', 'Characters'],
    ['/character/edit/4', 'Editing Bulbasaur', 'Characters'],
    ['/character/edit/4/games', 'Games featuring Bulbasaur', 'Characters'],
    ['/character/edit/4/moves', 'Moves available to Bulbasaur', 'Characters'],
    ['/character/detail/4', 'Bulbasaur', 'Characters'],
    ['/character/create', 'Create a Character', 'Characters'],
    ['/move/list', 'All Moves', 'Moves'],
    ['/move/edit/4', 'Editing Move 4', 'Moves'],
    ['/move/create', 'Create a Move', 'Moves'],
    ['/pokedex/list', 'All Pokédexes', 'Pokédexes'],
    ['/pokedex/edit/2', 'Editing Pokédex 2', 'Pokédexes'],
    ['/pokedex/edit/2/games', 'Manage Games', 'Pokédexes'],
    ['/pokedex/create', 'Create a Pokédex', 'Pokédexes'],
  ])('%s renders "%s" and highlights %s in the navbar', async (path, title, navLabel) => {
    renderApp(path)
    expect(await screen.findByRole('heading', { name: title })).toBeInTheDocument()
    if (path.startsWith('/game/edit')) {
      expect(await screen.findByDisplayValue('Red')).toBeInTheDocument()
    }
    if (path === '/game/list') {
      expect(await screen.findByRole('cell', { name: 'Red' })).toBeInTheDocument()
    }
    if (path.startsWith('/move/edit')) {
      expect(await screen.findByDisplayValue('Tackle')).toBeInTheDocument()
    }
    if (path === '/move/list') {
      expect(await screen.findByRole('cell', { name: 'Tackle' })).toBeInTheDocument()
    }
    if (path === '/character/list') {
      expect(await screen.findByRole('cell', { name: 'Bulbasaur' })).toBeInTheDocument()
    }
    if (path === '/character/edit/4') {
      expect(await screen.findByDisplayValue('Bulbasaur')).toBeInTheDocument()
    }
    if (path === '/pokedex/list') {
      expect(await screen.findByRole('cell', { name: 'Kanto' })).toBeInTheDocument()
    }
    if (path === '/pokedex/edit/2') {
      expect(await screen.findByDisplayValue('Kanto')).toBeInTheDocument()
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
    expect(await screen.findByRole('heading', { name: 'All Moves' })).toBeInTheDocument()
  })
})

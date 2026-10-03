import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routes } from './routes'

const renderAt = (path: string) => {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
  return router
}

describe('routes', () => {
  it('renders the home page with links to each section', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { name: 'Pokédex Admin' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveClass('active')
  })

  it.each([
    ['/game/list', 'Games', 'Games'],
    ['/game/edit/12', 'Edit Game', 'Games'],
    ['/character/edit/4/moves', 'Character Moves', 'Characters'],
    ['/move/create', 'Create Move', 'Moves'],
    ['/pokedex/edit/2/games', 'Pokédex Games', 'Pokédexes'],
  ])('%s renders "%s" and highlights %s in the navbar', (path, title, navLabel) => {
    renderAt(path)
    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()

    const nav = screen.getByRole('navigation')
    const navLinks = Array.from(nav.querySelectorAll('a.nav-link'))
    const active = navLinks.filter((a) => a.classList.contains('active'))
    expect(active.map((a) => a.textContent)).toEqual([navLabel])
  })

  it('shows a not found page for unknown paths', () => {
    renderAt('/nope')
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('navigates from the home page to a section', async () => {
    const router = renderAt('/')
    const main = screen.getByRole('main')
    await userEvent.click(within(main).getByRole('link', { name: 'Moves' }))
    expect(router.state.location.pathname).toBe('/move/list')
  })
})

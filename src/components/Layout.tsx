import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Link, Outlet, useLocation } from 'react-router'
import logo from '../assets/logo.png'

// `section` keeps a link active on every page of its section (list, edit,
// create), not just the page it points to.
const links = [
  { to: '/', section: null, label: 'Home' },
  { to: '/pokedex/list', section: '/pokedex/', label: 'Pokédexes' },
  { to: '/game/list', section: '/game/', label: 'Games' },
  { to: '/character/list', section: '/character/', label: 'Characters' },
  { to: '/move/list', section: '/move/', label: 'Moves' },
]

export default function Layout() {
  const { pathname } = useLocation()

  return (
    <>
      <Navbar aria-label="Main" bg="dark" data-bs-theme="dark" expand="md">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            <img src={logo} width={32} height={32} alt="Pokédex Admin" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="nav-collapse" />
          <Navbar.Collapse id="nav-collapse">
            <Nav>
              {links.map(({ to, section, label }) => (
                <Nav.Link
                  key={to}
                  as={Link}
                  to={to}
                  active={section ? pathname.startsWith(section) : pathname === to}
                >
                  {label}
                </Nav.Link>
              ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container fluid as="main">
        <Outlet />
      </Container>
    </>
  )
}

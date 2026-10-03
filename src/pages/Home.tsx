import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import { Link } from 'react-router'

const sections = [
  { to: '/pokedex/list', label: 'Pokédexes' },
  { to: '/game/list', label: 'Games' },
  { to: '/character/list', label: 'Characters' },
  { to: '/move/list', label: 'Moves' },
]

export default function Home() {
  return (
    <div className="home">
      <h1>Pokédex Admin</h1>
      <Row>
        <Col sm={4}>
          <ListGroup>
            {sections.map(({ to, label }) => (
              <ListGroup.Item key={to} action as={Link} to={to}>
                {label}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </div>
  )
}

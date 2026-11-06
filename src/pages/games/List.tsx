import Alert from 'react-bootstrap/Alert'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import { Link, useNavigate } from 'react-router'
import { errorMessage } from '../../api'
import { useGames } from '../../queries/games'

export default function GameList() {
  const navigate = useNavigate()
  const games = useGames()
  const rows = games.data ?? []

  return (
    <div id="games">
      <Breadcrumb>
        <Breadcrumb.Item active>Games</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h1 className="h4 mb-0">All Games</h1>
          <Link to="/game/create" className="btn btn-info btn-sm">
            Add New Game
          </Link>
        </Card.Header>
        <Card.Body>
          {games.isError && <Alert variant="danger">{errorMessage(games.error)}</Alert>}
          <Table hover>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name ID</th>
                <th scope="col">Name</th>
                <th scope="col">Generation</th>
                <th scope="col">Regions</th>
              </tr>
            </thead>
            <tbody>
              {games.isLoading && (
                <tr>
                  <td colSpan={5}>Loading…</td>
                </tr>
              )}
              {rows.map((game) => (
                <tr
                  key={game.game_id}
                  onClick={() => navigate(`/game/edit/${game.game_id}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') navigate(`/game/edit/${game.game_id}`)
                  }}
                  tabIndex={0}
                >
                  <td>{game.game_id}</td>
                  <td>{game.name_id}</td>
                  <td>{game.name}</td>
                  <td>{game.generation}</td>
                  <td>{(game.regions ?? []).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  )
}

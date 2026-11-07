import Alert from 'react-bootstrap/Alert'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import { Link, useNavigate } from 'react-router'
import { errorMessage } from '../../api'
import { usePokedexes } from '../../queries/pokedexes'

export default function PokedexList() {
  const navigate = useNavigate()
  const pokedexes = usePokedexes()
  const rows = pokedexes.data ?? []

  return (
    <div id="pokedexes">
      <Breadcrumb>
        <Breadcrumb.Item active>Pokédexes</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h1 className="h4 mb-0">All Pokédexes</h1>
          <Link to="/pokedex/create" className="btn btn-info btn-sm">
            Add New Pokédex
          </Link>
        </Card.Header>
        <Card.Body>
          {pokedexes.isError && <Alert variant="danger">{errorMessage(pokedexes.error)}</Alert>}
          <Table hover>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name ID</th>
                <th scope="col">Name</th>
                <th scope="col">Alternate Name</th>
                <th scope="col">Generation</th>
              </tr>
            </thead>
            <tbody>
              {pokedexes.isLoading && (
                <tr>
                  <td colSpan={5}>Loading…</td>
                </tr>
              )}
              {rows.map((pokedex) => (
                <tr
                  key={pokedex.game_group_id}
                  onClick={() => navigate(`/pokedex/edit/${pokedex.game_group_id}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      navigate(`/pokedex/edit/${pokedex.game_group_id}`)
                    }
                  }}
                  tabIndex={0}
                >
                  <td>{pokedex.game_group_id}</td>
                  <td>{pokedex.name_id}</td>
                  <td>{pokedex.name}</td>
                  <td>{pokedex.alternate_name}</td>
                  <td>{pokedex.generation}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  )
}

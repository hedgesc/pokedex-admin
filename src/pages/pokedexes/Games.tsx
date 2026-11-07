import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import { Link, useParams } from 'react-router'
import { errorMessage } from '../../api'
import { useToast } from '../../components/ToastProvider'
import { useGames } from '../../queries/games'
import { useAddPokedexGame, usePokedexGames, useRemovePokedexGame } from '../../queries/pokedexes'

export default function PokedexGames() {
  const params = useParams()
  const id = Number(params.id)
  const toast = useToast()
  const allGames = useGames()
  const pokedexGames = usePokedexGames(id)
  const addGame = useAddPokedexGame(id)
  const removeGame = useRemovePokedexGame(id)
  const [gameId, setGameId] = useState('')
  const chosen = (allGames.data ?? []).find((game) => String(game.game_id) === gameId)
  const busy = addGame.isPending || removeGame.isPending

  async function onAdd() {
    if (!chosen) return
    if ((pokedexGames.data ?? []).some((game) => game.game_id === chosen.game_id)) {
      toast.error(`Game ${chosen.game_id} has already been added.`)
      return
    }
    try {
      const message = await addGame.mutateAsync(chosen)
      toast.success(message)
      setGameId('')
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  async function onRemove(gameIdToRemove: number) {
    try {
      const message = await removeGame.mutateAsync(gameIdToRemove)
      toast.success(message)
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  return (
    <div id="pokedex-edit-games">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/pokedex/list' }}>
          Pokédexes
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/pokedex/edit/${params.id}` }}>
          {params.id}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Games</Breadcrumb.Item>
      </Breadcrumb>
      <div className="row">
        <div className="col-sm">
          <Card>
            <Card.Header>
              <h1 className="h4 mb-0">Manage Games</h1>
            </Card.Header>
            <Card.Body>
              <div className="d-flex gap-2 mb-3">
                <Form.Select
                  size="lg"
                  aria-label="Game"
                  value={gameId}
                  onChange={(event) => setGameId(event.target.value)}
                >
                  <option value="">Select a game…</option>
                  {(allGames.data ?? []).map((game) => (
                    <option key={game.game_id} value={game.game_id}>
                      {game.name}
                    </option>
                  ))}
                </Form.Select>
                <Button size="lg" disabled={!chosen || busy} onClick={() => void onAdd()}>
                  Add
                </Button>
              </div>
              {allGames.isError && <Alert variant="danger">{errorMessage(allGames.error)}</Alert>}
              {pokedexGames.isError && (
                <Alert variant="danger">{errorMessage(pokedexGames.error)}</Alert>
              )}
              <ListGroup>
                {(pokedexGames.data ?? []).map((game) => (
                  <ListGroup.Item
                    key={game.game_id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <strong>{game.name}</strong>
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      aria-label={`Remove ${game.name}`}
                      disabled={busy}
                      onClick={() => void onRemove(game.game_id)}
                    >
                      <span className="material-icons">cancel</span>
                    </button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </div>
        <div className="col-sm" />
      </div>
      <div className="row form-actions">
        <div className="col-sm">
          <Link to={`/pokedex/edit/${params.id}`} className="a-cancel">
            Back
          </Link>
        </div>
        <div className="col-sm" />
      </div>
    </div>
  )
}

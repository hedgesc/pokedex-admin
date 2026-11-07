import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import { Link, useNavigate, useParams } from 'react-router'
import { errorMessage } from '../../api'
import { useToast } from '../../components/ToastProvider'
import {
  useDeletePokedex,
  usePokedex,
  usePokedexGames,
  useUpdatePokedex,
} from '../../queries/pokedexes'
import { formToInput, pokedexToForm, type PokedexFormValues } from './form'
import { PokedexForm } from './PokedexForm'

export default function PokedexEdit() {
  const params = useParams()
  const id = Number(params.id)
  const navigate = useNavigate()
  const toast = useToast()
  const pokedex = usePokedex(id)
  const games = usePokedexGames(id)
  const updatePokedex = useUpdatePokedex(id)
  const deletePokedex = useDeletePokedex()
  const [draft, setDraft] = useState<{ id: number; values: PokedexFormValues } | null>(null)
  const busy = updatePokedex.isPending || deletePokedex.isPending
  const values =
    pokedex.data == null
      ? null
      : draft?.id === pokedex.data.game_group_id
        ? draft.values
        : pokedexToForm(pokedex.data)

  async function onSubmit() {
    if (!values) return
    try {
      const message = await updatePokedex.mutateAsync(formToInput(values))
      toast.success(message)
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  async function onDelete() {
    const yes = await toast.confirm('Are you sure?')
    if (!yes) return
    try {
      const message = await deletePokedex.mutateAsync(id)
      toast.success(message)
      navigate('/pokedex/list')
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  return (
    <div id="pokedex-edit">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/pokedex/list' }}>
          Pokédexes
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{params.id}</Breadcrumb.Item>
      </Breadcrumb>
      <div className="row">
        <div className="col-sm">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h1 className="h4 mb-0">Editing Pokédex {Number.isFinite(id) ? id : ''}</h1>
              <Button variant="danger" size="sm" onClick={() => void onDelete()}>
                Delete
              </Button>
            </Card.Header>
            <Card.Body>
              {pokedex.isLoading && <p>Loading…</p>}
              {pokedex.isError && <Alert variant="danger">{errorMessage(pokedex.error)}</Alert>}
              {values && (
                <PokedexForm
                  values={values}
                  onChange={(next) => {
                    if (pokedex.data) setDraft({ id: pokedex.data.game_group_id, values: next })
                  }}
                  disabled={busy}
                />
              )}
            </Card.Body>
          </Card>
          <div className="row form-actions">
            <div className="col">
              <Button
                variant="primary"
                className="float-end"
                disabled={busy || !values}
                onClick={() => void onSubmit()}
              >
                Save
              </Button>
              <Link to="/pokedex/list" className="a-cancel">
                Back
              </Link>
            </div>
          </div>
        </div>
        <div className="col-sm">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h2 className="h4 mb-0">Pokédex Games</h2>
              <Link to={`/pokedex/edit/${params.id}/games`} className="btn btn-info btn-sm">
                Manage
              </Link>
            </Card.Header>
            <Card.Body>
              {games.isError && <Alert variant="danger">{errorMessage(games.error)}</Alert>}
              <ListGroup>
                {(games.data ?? []).map((game) => (
                  <ListGroup.Item key={game.game_id} className="d-flex justify-content-between">
                    <strong>{game.name}</strong>
                    <Badge bg="dark" pill>
                      {game.generation}
                    </Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  )
}

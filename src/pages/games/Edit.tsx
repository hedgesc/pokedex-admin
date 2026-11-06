import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { Link, useNavigate, useParams } from 'react-router'
import { errorMessage } from '../../api'
import { useToast } from '../../components/ToastProvider'
import { useDeleteGame, useGame, useUpdateGame } from '../../queries/games'
import { GameForm } from './GameForm'
import { formToInput, gameToForm, type GameFormValues } from './form'

export default function GameEdit() {
  const params = useParams()
  const id = Number(params.id)
  const navigate = useNavigate()
  const toast = useToast()
  const game = useGame(id)
  const updateGame = useUpdateGame(id)
  const deleteGame = useDeleteGame()
  const [draft, setDraft] = useState<{ id: number; values: GameFormValues } | null>(null)
  const busy = updateGame.isPending || deleteGame.isPending
  const values =
    game.data == null
      ? null
      : draft?.id === game.data.game_id
        ? draft.values
        : gameToForm(game.data)

  async function onSubmit() {
    if (!values) return
    try {
      const message = await updateGame.mutateAsync(formToInput(values))
      toast.success(message)
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  async function onDelete() {
    const yes = await toast.confirm('Are you sure?')
    if (!yes) return
    try {
      const message = await deleteGame.mutateAsync(id)
      toast.success(message)
      navigate('/game/list')
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  return (
    <div id="game-edit">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/game/list' }}>
          Games
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{params.id}</Breadcrumb.Item>
      </Breadcrumb>
      <div className="row">
        <div className="col-sm">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h1 className="h4 mb-0">Editing Game {Number.isFinite(id) ? id : ''}</h1>
              <Button variant="danger" size="sm" onClick={() => void onDelete()}>
                Delete
              </Button>
            </Card.Header>
            <Card.Body>
              {game.isLoading && <p>Loading…</p>}
              {game.isError && <Alert variant="danger">{errorMessage(game.error)}</Alert>}
              {values && (
                <GameForm
                  values={values}
                  onChange={(next) => {
                    if (game.data) setDraft({ id: game.data.game_id, values: next })
                  }}
                  disabled={busy}
                />
              )}
            </Card.Body>
          </Card>
        </div>
        <div className="col-sm" />
      </div>
      <div className="row form-actions">
        <div className="col-sm">
          <Button
            variant="primary"
            className="float-end"
            disabled={busy || !values}
            onClick={() => void onSubmit()}
          >
            Save
          </Button>
          <Link to="/game/list" className="a-cancel">
            Back
          </Link>
        </div>
        <div className="col-sm" />
      </div>
    </div>
  )
}

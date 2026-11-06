import { useState } from 'react'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { Link, useNavigate } from 'react-router'
import { errorMessage } from '../../api'
import { useToast } from '../../components/ToastProvider'
import { useCreateGame } from '../../queries/games'
import { emptyGameForm, formToInput, type GameFormValues } from './form'
import { GameForm } from './GameForm'

export default function GameCreate() {
  const navigate = useNavigate()
  const toast = useToast()
  const createGame = useCreateGame()
  const [values, setValues] = useState<GameFormValues>(emptyGameForm)

  async function onSubmit() {
    try {
      const message = await createGame.mutateAsync(formToInput(values))
      toast.success(message)
      navigate('/game/list')
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  return (
    <div id="game-create">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/game/list' }}>
          Games
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Create</Breadcrumb.Item>
      </Breadcrumb>
      <div className="row">
        <div className="col-sm">
          <Card>
            <Card.Header>
              <h1 className="h4 mb-0">Create a Game</h1>
            </Card.Header>
            <Card.Body>
              <GameForm values={values} onChange={setValues} disabled={createGame.isPending} />
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
            disabled={createGame.isPending}
            onClick={() => void onSubmit()}
          >
            Create
          </Button>
          <Link to="/game/list" className="a-cancel">
            Cancel
          </Link>
        </div>
        <div className="col-sm" />
      </div>
    </div>
  )
}

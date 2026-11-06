import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { Link, useNavigate, useParams } from 'react-router'
import { errorMessage } from '../../api'
import { useToast } from '../../components/ToastProvider'
import { useDeleteMove, useMove, useUpdateMove } from '../../queries/moves'
import { formToInput, moveToForm, type MoveFormValues } from './form'
import { MoveForm } from './MoveForm'

export default function MoveEdit() {
  const params = useParams()
  const id = Number(params.id)
  const navigate = useNavigate()
  const toast = useToast()
  const move = useMove(id)
  const updateMove = useUpdateMove(id)
  const deleteMove = useDeleteMove()
  const [draft, setDraft] = useState<{ id: number; values: MoveFormValues } | null>(null)
  const busy = updateMove.isPending || deleteMove.isPending
  const values =
    move.data == null
      ? null
      : draft?.id === move.data.move_id
        ? draft.values
        : moveToForm(move.data)

  async function onSubmit() {
    if (!values) return
    try {
      const message = await updateMove.mutateAsync(formToInput(values))
      toast.success(message)
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  async function onDelete() {
    const yes = await toast.confirm('Are you sure?')
    if (!yes) return
    try {
      const message = await deleteMove.mutateAsync(id)
      toast.success(message)
      navigate('/move/list')
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  return (
    <div id="move-edit">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/move/list' }}>
          Moves
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{params.id}</Breadcrumb.Item>
      </Breadcrumb>
      <div className="row">
        <div className="col-md-8">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h1 className="h4 mb-0">Editing Move {Number.isFinite(id) ? id : ''}</h1>
              <Button variant="danger" size="sm" onClick={() => void onDelete()}>
                Delete
              </Button>
            </Card.Header>
            <Card.Body>
              {move.isLoading && <p>Loading…</p>}
              {move.isError && <Alert variant="danger">{errorMessage(move.error)}</Alert>}
              {values && (
                <MoveForm
                  values={values}
                  onChange={(next) => {
                    if (move.data) setDraft({ id: move.data.move_id, values: next })
                  }}
                  disabled={busy}
                />
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
      <div className="row form-actions">
        <div className="col-md-8">
          <Button
            variant="primary"
            className="float-end"
            disabled={busy || !values}
            onClick={() => void onSubmit()}
          >
            Save
          </Button>
          <Link to="/move/list" className="a-cancel">
            Back
          </Link>
        </div>
      </div>
    </div>
  )
}

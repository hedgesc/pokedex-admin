import { useState } from 'react'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { Link, useNavigate } from 'react-router'
import { errorMessage } from '../../api'
import { useToast } from '../../components/ToastProvider'
import { useCreateMove } from '../../queries/moves'
import { emptyMoveForm, formToInput, type MoveFormValues } from './form'
import { MoveForm } from './MoveForm'

export default function MoveCreate() {
  const navigate = useNavigate()
  const toast = useToast()
  const createMove = useCreateMove()
  const [values, setValues] = useState<MoveFormValues>(emptyMoveForm)

  async function onSubmit() {
    try {
      const message = await createMove.mutateAsync(formToInput(values))
      toast.success(message)
      navigate('/move/list')
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  return (
    <div id="move-create">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/move/list' }}>
          Moves
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Create</Breadcrumb.Item>
      </Breadcrumb>
      <div className="row">
        <div className="col-md-8">
          <Card>
            <Card.Header>
              <h1 className="h4 mb-0">Create a Move</h1>
            </Card.Header>
            <Card.Body>
              <MoveForm values={values} onChange={setValues} disabled={createMove.isPending} />
            </Card.Body>
          </Card>
        </div>
      </div>
      <div className="row form-actions">
        <div className="col-md-8">
          <Button
            variant="primary"
            className="float-end"
            disabled={createMove.isPending}
            onClick={() => void onSubmit()}
          >
            Create
          </Button>
          <Link to="/move/list" className="a-cancel">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  )
}

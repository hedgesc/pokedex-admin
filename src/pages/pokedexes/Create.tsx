import { useState } from 'react'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { Link, useNavigate } from 'react-router'
import { errorMessage } from '../../api'
import { useToast } from '../../components/ToastProvider'
import { useCreatePokedex } from '../../queries/pokedexes'
import { emptyPokedexForm, formToInput, type PokedexFormValues } from './form'
import { PokedexForm } from './PokedexForm'

export default function PokedexCreate() {
  const navigate = useNavigate()
  const toast = useToast()
  const createPokedex = useCreatePokedex()
  const [values, setValues] = useState<PokedexFormValues>(emptyPokedexForm)

  async function onSubmit() {
    try {
      const message = await createPokedex.mutateAsync(formToInput(values))
      toast.success(message)
      navigate('/pokedex/list')
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  return (
    <div id="pokedex-create">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/pokedex/list' }}>
          Pokédexes
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Create</Breadcrumb.Item>
      </Breadcrumb>
      <div className="row">
        <div className="col-sm">
          <Card>
            <Card.Header>
              <h1 className="h4 mb-0">Create a Pokédex</h1>
            </Card.Header>
            <Card.Body>
              <PokedexForm
                values={values}
                onChange={setValues}
                disabled={createPokedex.isPending}
              />
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
            disabled={createPokedex.isPending}
            onClick={() => void onSubmit()}
          >
            Create
          </Button>
          <Link to="/pokedex/list" className="a-cancel">
            Cancel
          </Link>
        </div>
        <div className="col-sm" />
      </div>
    </div>
  )
}

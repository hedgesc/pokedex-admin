import { useState } from 'react'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { Link, useNavigate } from 'react-router'
import { errorMessage } from '../../api'
import { useToast } from '../../components/ToastProvider'
import { useCharacters, useCreateCharacter } from '../../queries/characters'
import { CharacterForm } from './CharacterForm'
import { emptyCharacterForm, formToCreate, type CharacterFormValues } from './form'

export default function CharacterCreate() {
  const navigate = useNavigate()
  const toast = useToast()
  const characters = useCharacters()
  const createCharacter = useCreateCharacter()
  const [values, setValues] = useState<CharacterFormValues>(emptyCharacterForm)

  async function onSubmit() {
    try {
      const message = await createCharacter.mutateAsync(formToCreate(values))
      toast.success(message)
      navigate('/character/list')
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  return (
    <div id="character-create">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/character/list' }}>
          Characters
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Create</Breadcrumb.Item>
      </Breadcrumb>
      <div className="row">
        <div className="col-md-8">
          <Card>
            <Card.Header>
              <h1 className="h4 mb-0">Create a Character</h1>
            </Card.Header>
            <Card.Body>
              <CharacterForm
                values={values}
                onChange={setValues}
                disabled={createCharacter.isPending}
                characters={characters.data ?? []}
              />
            </Card.Body>
          </Card>
        </div>
      </div>
      <div className="row form-actions">
        <div className="col-md-8">
          <Button
            variant="primary"
            className="float-end"
            disabled={createCharacter.isPending}
            onClick={() => void onSubmit()}
          >
            Save
          </Button>
          <Link to="/character/list" className="a-cancel">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  )
}

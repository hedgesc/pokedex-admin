import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { Link, useNavigate, useParams } from 'react-router'
import { errorMessage } from '../../api'
import { useToast } from '../../components/ToastProvider'
import {
  useCharacter,
  useCharacters,
  useDeleteCharacter,
  useUpdateCharacter,
} from '../../queries/characters'
import { CharacterForm } from './CharacterForm'
import { characterToForm, formToInput, type CharacterFormValues } from './form'
import { SectionNav } from './SectionNav'

export default function CharacterEdit() {
  const params = useParams()
  const id = Number(params.id)
  const navigate = useNavigate()
  const toast = useToast()
  const character = useCharacter(id)
  const characters = useCharacters()
  const updateCharacter = useUpdateCharacter(id)
  const deleteCharacter = useDeleteCharacter()
  const [draft, setDraft] = useState<{ id: number; values: CharacterFormValues } | null>(null)
  const busy = updateCharacter.isPending || deleteCharacter.isPending
  const values =
    character.data == null
      ? null
      : draft?.id === character.data.character_id
        ? draft.values
        : characterToForm(character.data)
  const title = character.data?.name ?? params.id

  async function onSubmit() {
    if (!values) return
    try {
      const message = await updateCharacter.mutateAsync(formToInput(values))
      toast.success(message)
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  async function onDelete() {
    const yes = await toast.confirm('Are you sure?')
    if (!yes) return
    try {
      const message = await deleteCharacter.mutateAsync(id)
      toast.success(message)
      navigate('/character/list')
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  return (
    <div id="character-edit">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/character/list' }}>
          Characters
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{title}</Breadcrumb.Item>
      </Breadcrumb>
      {character.isLoading && <p>Loading…</p>}
      {character.isError && <Alert variant="danger">{errorMessage(character.error)}</Alert>}
      {values && (
        <div className="row">
          <div className="col-md-8">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h1 className="h4 mb-0">Editing {title}</h1>
                <Button variant="danger" size="sm" onClick={() => void onDelete()}>
                  Delete
                </Button>
              </Card.Header>
              <Card.Body>
                <CharacterForm
                  values={values}
                  onChange={(next) => {
                    if (character.data) setDraft({ id: character.data.character_id, values: next })
                  }}
                  disabled={busy}
                  characters={characters.data ?? []}
                  idReadOnly
                />
              </Card.Body>
            </Card>
            <div className="row form-actions">
              <div className="col">
                <Button
                  variant="primary"
                  className="float-end"
                  disabled={busy}
                  onClick={() => void onSubmit()}
                >
                  Save
                </Button>
                <Link to="/character/list" className="a-cancel">
                  Back
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <SectionNav id={String(params.id)} active="edit" />
          </div>
        </div>
      )}
    </div>
  )
}

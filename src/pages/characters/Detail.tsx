import Alert from 'react-bootstrap/Alert'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import { Link, useParams } from 'react-router'
import { errorMessage } from '../../api'
import { useCharacter } from '../../queries/characters'
import { SectionNav } from './SectionNav'

function ReadOnly({ id, label, value }: { id: string; label: string; value: string }) {
  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>{label}</Form.Label>
      <Form.Control size="lg" plaintext readOnly value={value} />
    </Form.Group>
  )
}

export default function CharacterDetail() {
  const params = useParams()
  const id = Number(params.id)
  const character = useCharacter(id)
  const data = character.data

  return (
    <div id="character-detail">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/character/list' }}>
          Characters
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{params.id}</Breadcrumb.Item>
      </Breadcrumb>
      {character.isLoading && <p>Loading…</p>}
      {character.isError && <Alert variant="danger">{errorMessage(character.error)}</Alert>}
      {data && (
        <div className="row">
          <div className="col-md-8">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h1 className="h4 mb-0">{data.name}</h1>
                <Link to={`/character/edit/${data.character_id}`} className="btn btn-info btn-sm">
                  Edit
                </Link>
              </Card.Header>
              <Card.Body>
                <div className="row">
                  <div className="col">
                    <ReadOnly
                      id="inputCharacterId"
                      label="Character Id"
                      value={String(data.character_id)}
                    />
                  </div>
                  <div className="col">
                    <ReadOnly
                      id="inputGeneration"
                      label="Generation"
                      value={String(data.generation)}
                    />
                  </div>
                  <div className="col">
                    <ReadOnly id="inputNameId" label="Name ID" value={data.name_id} />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <ReadOnly id="inputHP" label="HP" value={String(data.hp)} />
                  </div>
                  <div className="col">
                    <ReadOnly id="inputAttack" label="Attack" value={String(data.attack)} />
                  </div>
                  <div className="col">
                    <ReadOnly id="inputDefense" label="Defense" value={String(data.defense)} />
                  </div>
                  <div className="col">
                    <ReadOnly id="inputSpeed" label="Speed" value={String(data.speed)} />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <ReadOnly
                      id="inputSpecialAttack"
                      label="Special Attack"
                      value={String(data.special_attack)}
                    />
                  </div>
                  <div className="col">
                    <ReadOnly
                      id="inputSpecialDefense"
                      label="Special Defense"
                      value={String(data.special_defense)}
                    />
                  </div>
                  <div className="col">
                    <ReadOnly id="inputTotal" label="Total" value={String(data.total)} />
                  </div>
                </div>
                <ReadOnly id="inputImageUrl" label="Image URL" value={data.image_url ?? ''} />
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-2">
            <SectionNav id={String(params.id)} active="details" />
          </div>
        </div>
      )}
    </div>
  )
}

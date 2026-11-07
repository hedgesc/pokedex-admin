import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Nav from 'react-bootstrap/Nav'
import { Link, useParams } from 'react-router'
import { errorMessage, type CharacterMove } from '../../api'
import { useToast } from '../../components/ToastProvider'
import { useCharacter, useCharacterMoves, useSetMoveSuggested } from '../../queries/characters'
import { SectionNav } from './SectionNav'

const GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8]

export default function CharacterMoves() {
  const params = useParams()
  const id = Number(params.id)
  const toast = useToast()
  const character = useCharacter(id)
  const moves = useCharacterMoves(id)
  const setSuggested = useSetMoveSuggested(id)
  const [generation, setGeneration] = useState(1)
  const title = character.data?.name ?? params.id
  const inGeneration = (moves.data ?? []).filter((move) => move.generation === generation)
  const suggestedCount = inGeneration.filter((move) => move.is_suggested).length

  async function onSuggested(move: CharacterMove, isSuggested: boolean) {
    try {
      await setSuggested.mutateAsync({
        characterMoveId: move.character_move_id,
        isSuggested,
      })
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  return (
    <div id="character-moves">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/character/list' }}>
          Characters
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/character/edit/${params.id}` }}>
          {title}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Moves</Breadcrumb.Item>
      </Breadcrumb>
      {character.isError && <Alert variant="danger">{errorMessage(character.error)}</Alert>}
      {character.isLoading && <p>Loading…</p>}
      {character.data && (
        <div className="row">
          <div className="col-md-8">
            <Card>
              <Card.Header>
                <h1 className="h4 mb-0">Moves available to {character.data.name}</h1>
              </Card.Header>
              <Card.Body>
                <Nav variant="tabs" fill className="mb-3">
                  {GENERATIONS.map((gen) => (
                    <Nav.Item key={gen}>
                      <Nav.Link
                        as="button"
                        type="button"
                        active={gen === generation}
                        onClick={() => setGeneration(gen)}
                      >
                        {gen}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
                <div className="row fw-semibold border-bottom pb-2 mb-2">
                  <div className="col">Move</div>
                  <div className="col text-center">Generation</div>
                  <div className="col">Type</div>
                  <div className="col text-center">Power</div>
                  <div className="col text-center">Accuracy</div>
                  <div className="col text-center">Suggested</div>
                </div>
                {moves.isError && <Alert variant="danger">{errorMessage(moves.error)}</Alert>}
                {inGeneration.map((move) => (
                  <div
                    key={move.character_move_id}
                    className="row align-items-center border-bottom py-2"
                  >
                    <div className="col">{move.name}</div>
                    <div className="col text-center">{move.generation}</div>
                    <div className="col">{move.type}</div>
                    <div className="col text-center">{move.power}</div>
                    <div className="col text-center">{move.accuracy}</div>
                    <div className="col text-center">
                      <Form.Check
                        type="switch"
                        aria-label={`Suggested ${move.name}`}
                        checked={move.is_suggested}
                        disabled={
                          setSuggested.isPending || (suggestedCount >= 4 && !move.is_suggested)
                        }
                        onChange={(event) => void onSuggested(move, event.target.checked)}
                      />
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-2">
            <SectionNav id={String(params.id)} active="moves" />
          </div>
        </div>
      )}
    </div>
  )
}

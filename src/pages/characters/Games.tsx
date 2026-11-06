import { useState } from 'react'
import type { FormEvent } from 'react'
import Alert from 'react-bootstrap/Alert'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import { Link, useParams } from 'react-router'
import { errorMessage, type CharacterGame, type Id } from '../../api'
import { useToast } from '../../components/ToastProvider'
import { useGames } from '../../queries/games'
import {
  useAddCharacterGame,
  useCharacter,
  useCharacterGames,
  useRemoveCharacterGame,
  useUpdateCharacterGame,
} from '../../queries/characters'
import { SectionNav } from './SectionNav'

function numberOrNull(value: string): number | null {
  return value.trim() === '' ? null : Number(value)
}

function GameRow({ game, characterId }: { game: CharacterGame; characterId: Id }) {
  const toast = useToast()
  const updateGame = useUpdateCharacterGame(characterId)
  const removeGame = useRemoveCharacterGame(characterId)
  const [editing, setEditing] = useState(false)
  const [generation, setGeneration] = useState(String(game.generation ?? ''))
  const [dexId, setDexId] = useState(
    game.game_character_id == null ? '' : String(game.game_character_id),
  )
  const busy = updateGame.isPending || removeGame.isPending

  async function onSave(event: FormEvent) {
    event.preventDefault()
    try {
      const message = await updateGame.mutateAsync({
        gameId: game.game_id,
        input: {
          game_id: game.game_id,
          generation: Number(generation),
          game_character_id: numberOrNull(dexId),
        },
      })
      toast.success(message)
      setEditing(false)
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  async function onDelete() {
    try {
      const message = await removeGame.mutateAsync(game.game_id)
      toast.success(message)
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  if (!editing) {
    return (
      <div className="row align-items-center mb-2">
        <div className="col">{game.name}</div>
        <div className="col">{game.generation}</div>
        <div className="col">{game.game_character_id}</div>
        <div className="col">
          <Button size="sm" variant="info" className="me-2" onClick={() => setEditing(true)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" disabled={busy} onClick={() => void onDelete()}>
            Delete
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Form onSubmit={(event) => void onSave(event)} className="row align-items-center mb-2">
      <div className="col">{game.name}</div>
      <div className="col">
        <Form.Control
          size="sm"
          type="number"
          aria-label={`${game.name} generation`}
          value={generation}
          onChange={(event) => setGeneration(event.target.value)}
        />
      </div>
      <div className="col">
        <Form.Control
          size="sm"
          type="number"
          aria-label={`${game.name} character id`}
          value={dexId}
          onChange={(event) => setDexId(event.target.value)}
        />
      </div>
      <div className="col">
        <Button size="sm" type="submit" variant="primary" className="me-2" disabled={busy}>
          Save
        </Button>
        <Button size="sm" type="button" variant="danger" onClick={() => setEditing(false)}>
          Cancel
        </Button>
      </div>
    </Form>
  )
}

export default function CharacterGames() {
  const params = useParams()
  const id = Number(params.id)
  const toast = useToast()
  const character = useCharacter(id)
  const games = useGames()
  const characterGames = useCharacterGames(id)
  const addGame = useAddCharacterGame(id)
  const [gameId, setGameId] = useState('')
  const [generation, setGeneration] = useState('')
  const [dexId, setDexId] = useState('')
  const title = character.data?.name ?? params.id

  function reset() {
    setGameId('')
    setGeneration('')
    setDexId('')
  }

  async function onAdd(event: FormEvent) {
    event.preventDefault()
    if (!gameId) return
    try {
      const created = await addGame.mutateAsync({
        game_id: Number(gameId),
        generation: Number(generation),
        game_character_id: numberOrNull(dexId),
      })
      toast.success(`Game Character ${created} created`)
      reset()
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  return (
    <div id="character-games">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/character/list' }}>
          Characters
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/character/edit/${params.id}` }}>
          {title}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Games</Breadcrumb.Item>
      </Breadcrumb>
      {character.isError && <Alert variant="danger">{errorMessage(character.error)}</Alert>}
      {character.isLoading && <p>Loading…</p>}
      {character.data && (
        <div className="row">
          <div className="col-md-8">
            <Card>
              <Card.Header>
                <h1 className="h4 mb-0">Games featuring {character.data.name}</h1>
              </Card.Header>
              <Card.Body>
                <Form
                  className="row g-2 align-items-center"
                  onSubmit={(event) => void onAdd(event)}
                >
                  <div className="col">
                    <Form.Select
                      size="sm"
                      aria-label="Game"
                      value={gameId}
                      onChange={(event) => setGameId(event.target.value)}
                    >
                      <option value="">Game</option>
                      {(games.data ?? []).map((game) => (
                        <option key={game.game_id} value={game.game_id}>
                          {game.name}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <div className="col">
                    <Form.Control
                      size="sm"
                      type="number"
                      placeholder="Generation"
                      aria-label="Generation"
                      value={generation}
                      onChange={(event) => setGeneration(event.target.value)}
                    />
                  </div>
                  <div className="col">
                    <Form.Control
                      size="sm"
                      type="number"
                      placeholder="Character Id"
                      aria-label="Character Id"
                      value={dexId}
                      onChange={(event) => setDexId(event.target.value)}
                    />
                  </div>
                  <div className="col">
                    <Button
                      size="sm"
                      type="submit"
                      variant="primary"
                      className="me-2"
                      disabled={addGame.isPending}
                    >
                      Add
                    </Button>
                    <Button size="sm" type="button" variant="danger" onClick={reset}>
                      Reset
                    </Button>
                  </div>
                </Form>
                <hr />
                <div className="row fw-semibold mb-2">
                  <div className="col">Game</div>
                  <div className="col">Generation</div>
                  <div className="col">Character Id</div>
                  <div className="col" />
                </div>
                {characterGames.isError && (
                  <Alert variant="danger">{errorMessage(characterGames.error)}</Alert>
                )}
                {(characterGames.data ?? []).map((game) => (
                  <GameRow key={game.character_game_id} game={game} characterId={id} />
                ))}
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-2">
            <SectionNav id={String(params.id)} active="games" />
          </div>
        </div>
      )}
    </div>
  )
}

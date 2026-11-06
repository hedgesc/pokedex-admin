import Form from 'react-bootstrap/Form'
import type { Character } from '../../api'
import { CHARACTER_TYPES, type CharacterType } from '../../constants/characterTypes'
import type { CharacterFormValues } from './form'

export function CharacterForm({
  values,
  onChange,
  disabled,
  characters,
  idReadOnly,
}: {
  values: CharacterFormValues
  onChange: (values: CharacterFormValues) => void
  disabled?: boolean
  characters: Character[]
  idReadOnly?: boolean
}) {
  const set = (field: keyof CharacterFormValues) => (event: { target: { value: string } }) => {
    onChange({ ...values, [field]: event.target.value })
  }
  const remaining = CHARACTER_TYPES.filter((type) => !values.types.includes(type))

  return (
    <fieldset disabled={disabled}>
      <div className="row">
        <Form.Group className="col-md-6 mb-3" controlId="inputCharacterId">
          <Form.Label>Character Id</Form.Label>
          <Form.Control
            size="lg"
            type="number"
            value={values.character_id}
            readOnly={idReadOnly}
            onChange={set('character_id')}
          />
        </Form.Group>
        <Form.Group className="col-md-6 mb-3" controlId="inputGeneration">
          <Form.Label>Generation</Form.Label>
          <Form.Control
            size="lg"
            type="number"
            value={values.generation}
            onChange={set('generation')}
          />
        </Form.Group>
      </div>
      <div className="row">
        <Form.Group className="col-md-6 mb-3" controlId="inputName">
          <Form.Label>Name</Form.Label>
          <Form.Control size="lg" type="text" value={values.name} onChange={set('name')} />
        </Form.Group>
        <Form.Group className="col-md-6 mb-3" controlId="inputNameId">
          <Form.Label>Name ID</Form.Label>
          <Form.Control size="lg" type="text" value={values.name_id} onChange={set('name_id')} />
        </Form.Group>
      </div>
      <div className="row">
        <Form.Group className="col-md-3 mb-3" controlId="inputHP">
          <Form.Label>HP</Form.Label>
          <Form.Control size="lg" type="number" value={values.hp} onChange={set('hp')} />
        </Form.Group>
        <Form.Group className="col-md-3 mb-3" controlId="inputAttack">
          <Form.Label>Attack</Form.Label>
          <Form.Control size="lg" type="number" value={values.attack} onChange={set('attack')} />
        </Form.Group>
        <Form.Group className="col-md-3 mb-3" controlId="inputDefense">
          <Form.Label>Defense</Form.Label>
          <Form.Control size="lg" type="number" value={values.defense} onChange={set('defense')} />
        </Form.Group>
        <Form.Group className="col-md-3 mb-3" controlId="inputSpeed">
          <Form.Label>Speed</Form.Label>
          <Form.Control size="lg" type="number" value={values.speed} onChange={set('speed')} />
        </Form.Group>
      </div>
      <div className="row">
        <Form.Group className="col-md-3 mb-3" controlId="inputSpecialAttack">
          <Form.Label>Special Attack</Form.Label>
          <Form.Control
            size="lg"
            type="number"
            value={values.special_attack}
            onChange={set('special_attack')}
          />
        </Form.Group>
        <Form.Group className="col-md-3 mb-3" controlId="inputSpecialDefense">
          <Form.Label>Special Defense</Form.Label>
          <Form.Control
            size="lg"
            type="number"
            value={values.special_defense}
            onChange={set('special_defense')}
          />
        </Form.Group>
        <Form.Group className="col-md-3 mb-3" controlId="inputTotal">
          <Form.Label>Total</Form.Label>
          <Form.Control size="lg" type="number" value={values.total} onChange={set('total')} />
        </Form.Group>
      </div>
      <Form.Group className="mb-3" controlId="inputImageUrl">
        <Form.Label>Image URL</Form.Label>
        <Form.Control size="lg" type="text" value={values.image_url} onChange={set('image_url')} />
      </Form.Group>
      <div className="row">
        <Form.Group className="col-md-6 mb-3" controlId="inputEvolvesFrom">
          <Form.Label>Evolves From</Form.Label>
          <Form.Select size="lg" value={values.evolves_from_id} onChange={set('evolves_from_id')}>
            <option value="">None</option>
            {characters.map((character) => (
              <option key={character.character_id} value={character.character_id}>
                {character.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="col-md-6 mb-3" controlId="inputTypes">
          <Form.Label>Types</Form.Label>
          <div className="d-flex flex-wrap gap-2 mb-2">
            {values.types.map((type) => (
              <span key={type} className={`badge type-tag ${type.toLowerCase()}`}>
                {type}{' '}
                <button
                  type="button"
                  className="btn btn-sm btn-link text-white p-0 align-baseline"
                  aria-label={`Remove ${type}`}
                  onClick={() =>
                    onChange({ ...values, types: values.types.filter((item) => item !== type) })
                  }
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <Form.Select
            size="lg"
            value=""
            disabled={disabled || remaining.length === 0}
            onChange={(event) => {
              const type = event.target.value as CharacterType
              if (!type) return
              onChange({ ...values, types: [...values.types, type] })
            }}
          >
            <option value="">Add a type…</option>
            {remaining.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>
    </fieldset>
  )
}

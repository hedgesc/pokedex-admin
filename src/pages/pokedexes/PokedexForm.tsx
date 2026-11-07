import Form from 'react-bootstrap/Form'
import type { PokedexFormValues } from './form'

export function PokedexForm({
  values,
  onChange,
  disabled,
}: {
  values: PokedexFormValues
  onChange: (values: PokedexFormValues) => void
  disabled?: boolean
}) {
  const set = (field: keyof PokedexFormValues) => (event: { target: { value: string } }) => {
    onChange({ ...values, [field]: event.target.value })
  }

  return (
    <fieldset disabled={disabled}>
      <Form.Group className="mb-3" controlId="inputNameId">
        <Form.Label>Name ID</Form.Label>
        <Form.Control size="lg" type="text" value={values.name_id} onChange={set('name_id')} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="inputName">
        <Form.Label>Name</Form.Label>
        <Form.Control size="lg" type="text" value={values.name} onChange={set('name')} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="inputAltName">
        <Form.Label>Alternate Name</Form.Label>
        <Form.Control
          size="lg"
          type="text"
          value={values.alternate_name}
          onChange={set('alternate_name')}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="inputGeneration">
        <Form.Label>Generation</Form.Label>
        <Form.Control
          size="lg"
          type="number"
          value={values.generation}
          onChange={set('generation')}
        />
      </Form.Group>
    </fieldset>
  )
}

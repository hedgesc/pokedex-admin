import Form from 'react-bootstrap/Form'
import { CHARACTER_TYPES } from '../../constants/characterTypes'
import { MOVE_CATEGORIES } from '../../constants/moveCategories'
import type { MoveFormValues } from './form'

export function MoveForm({
  values,
  onChange,
  disabled,
}: {
  values: MoveFormValues
  onChange: (values: MoveFormValues) => void
  disabled?: boolean
}) {
  const set = (field: keyof MoveFormValues) => (event: { target: { value: string } }) => {
    onChange({ ...values, [field]: event.target.value })
  }

  return (
    <fieldset disabled={disabled}>
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
        <Form.Group className="col-md-3 mb-3" controlId="inputGeneration">
          <Form.Label>Generation</Form.Label>
          <Form.Control
            size="lg"
            type="number"
            value={values.generation}
            onChange={set('generation')}
          />
        </Form.Group>
        <Form.Group className="col-md-3 mb-3" controlId="inputPower">
          <Form.Label>Power</Form.Label>
          <Form.Control size="lg" type="number" value={values.power} onChange={set('power')} />
        </Form.Group>
        <Form.Group className="col-md-3 mb-3" controlId="inputAccuracy">
          <Form.Label>Accuracy</Form.Label>
          <Form.Control
            size="lg"
            type="number"
            value={values.accuracy}
            onChange={set('accuracy')}
          />
        </Form.Group>
        <Form.Group className="col-md-3 mb-3" controlId="inputPP">
          <Form.Label>PP</Form.Label>
          <Form.Control size="lg" type="number" value={values.pp} onChange={set('pp')} />
        </Form.Group>
      </div>
      <div className="row">
        <Form.Group className="col-md-6 mb-3" controlId="inputType">
          <Form.Label>Type</Form.Label>
          <Form.Select size="lg" value={values.type} onChange={set('type')}>
            <option value="">Select a type…</option>
            {CHARACTER_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="col-md-6 mb-3" controlId="inputCategory">
          <Form.Label>Category</Form.Label>
          <Form.Select size="lg" value={values.category} onChange={set('category')}>
            <option value="">Select a category…</option>
            {MOVE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>
    </fieldset>
  )
}

import Form from 'react-bootstrap/Form'
import { REGIONS, type Region } from '../../constants/regions'
import type { GameFormValues } from './form'

export function GameForm({
  values,
  onChange,
  disabled,
}: {
  values: GameFormValues
  onChange: (values: GameFormValues) => void
  disabled?: boolean
}) {
  const remaining = REGIONS.filter((region) => !values.regions.includes(region))

  return (
    <fieldset disabled={disabled}>
      <Form.Group className="mb-3" controlId="inputGeneration">
        <Form.Label>Generation</Form.Label>
        <Form.Control
          size="lg"
          type="number"
          value={values.generation}
          onChange={(event) => onChange({ ...values, generation: event.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="inputNameId">
        <Form.Label>Name ID</Form.Label>
        <Form.Control
          size="lg"
          type="text"
          value={values.name_id}
          onChange={(event) => onChange({ ...values, name_id: event.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="inputName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          size="lg"
          type="text"
          value={values.name}
          onChange={(event) => onChange({ ...values, name: event.target.value })}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="inputRegions">
        <Form.Label>Regions</Form.Label>
        <div className="d-flex flex-wrap gap-2 mb-2">
          {values.regions.map((region) => (
            <span key={region} className="badge text-bg-secondary">
              {region}{' '}
              <button
                type="button"
                className="btn btn-sm btn-link text-white p-0 align-baseline"
                aria-label={`Remove ${region}`}
                onClick={() =>
                  onChange({ ...values, regions: values.regions.filter((item) => item !== region) })
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
            const region = event.target.value as Region
            if (!region) return
            onChange({ ...values, regions: [...values.regions, region] })
          }}
        >
          <option value="">Add a region…</option>
          {remaining.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </fieldset>
  )
}

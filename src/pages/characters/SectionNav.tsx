import { Link } from 'react-router'

export function SectionNav({
  id,
  active,
}: {
  id: string
  active: 'details' | 'edit' | 'games' | 'moves'
}) {
  const item = (to: string, label: string, isActive = false) =>
    isActive ? (
      <span className="list-group-item active">{label}</span>
    ) : (
      <Link className="list-group-item list-group-item-action" to={to}>
        {label}
      </Link>
    )

  return (
    <div className="list-group">
      {active === 'details' && item('', 'Details', true)}
      {active === 'details' && item(`/character/edit/${id}/games`, 'Games')}
      {active === 'details' && item(`/character/edit/${id}/moves`, 'Moves')}
      {active !== 'details' &&
        item(`/character/edit/${id}/games`, 'Manage Games', active === 'games')}
      {active !== 'details' &&
        item(`/character/edit/${id}/moves`, 'Manage Moves', active === 'moves')}
      {active === 'moves' && (
        <Link
          className="list-group-item list-group-item-action"
          to={`/character/edit/${Number(id) + 1}`}
        >
          <span className="material-icons float-end">chevron_right</span>
          Next Character
        </Link>
      )}
    </div>
  )
}

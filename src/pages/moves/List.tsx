import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Card from 'react-bootstrap/Card'
import Pagination from 'react-bootstrap/Pagination'
import Table from 'react-bootstrap/Table'
import { Link, useNavigate } from 'react-router'
import { errorMessage } from '../../api'
import { useMovesPage } from '../../queries/moves'

const PAGE_SIZE = 8

export default function MoveList() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const moves = useMovesPage({ limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE })
  const rows = moves.data?.items ?? []
  const pageCount = Math.ceil((moves.data?.total_count ?? 0) / PAGE_SIZE)
  const visiblePages = Array.from({ length: pageCount }, (_, index) => index + 1).slice(
    page - 1,
    page + 5,
  )

  return (
    <div id="moves">
      <Breadcrumb>
        <Breadcrumb.Item active>Moves</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h1 className="h4 mb-0">All Moves</h1>
          <Link to="/move/create" className="btn btn-info btn-sm">
            Add New Move
          </Link>
        </Card.Header>
        <Card.Body>
          {moves.isError && <Alert variant="danger">{errorMessage(moves.error)}</Alert>}
          <Table hover className="align-middle">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col" className="text-center">
                  Generation
                </th>
                <th scope="col">Type</th>
                <th scope="col" className="text-center">
                  Power
                </th>
                <th scope="col" className="text-center">
                  Accuracy
                </th>
                <th scope="col" className="text-center">
                  PP
                </th>
                <th scope="col">Category</th>
                <th scope="col">Name ID</th>
              </tr>
            </thead>
            <tbody>
              {moves.isLoading && (
                <tr>
                  <td colSpan={9}>Loading…</td>
                </tr>
              )}
              {rows.map((move) => (
                <tr
                  key={move.move_id}
                  onClick={() => navigate(`/move/edit/${move.move_id}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') navigate(`/move/edit/${move.move_id}`)
                  }}
                  tabIndex={0}
                >
                  <td>{move.move_id}</td>
                  <td>{move.name}</td>
                  <td className="text-center">{move.generation}</td>
                  <td>{move.type}</td>
                  <td className="text-center">{move.power}</td>
                  <td className="text-center">{move.accuracy}</td>
                  <td className="text-center">{move.pp}</td>
                  <td>{move.category}</td>
                  <td>{move.name_id}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer>
          <nav aria-label="move list pagination">
            <Pagination className="justify-content-center mb-0">
              <Pagination.Prev
                disabled={page === 1}
                onClick={() => setPage((current) => current - 1)}
              />
              {visiblePages.map((pageNumber) => (
                <Pagination.Item
                  key={pageNumber}
                  active={pageNumber === page}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </Pagination.Item>
              ))}
              {page < pageCount && (
                <Pagination.Next onClick={() => setPage((current) => current + 1)} />
              )}
            </Pagination>
          </nav>
        </Card.Footer>
      </Card>
    </div>
  )
}

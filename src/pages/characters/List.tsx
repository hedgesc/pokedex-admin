import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Card from 'react-bootstrap/Card'
import Pagination from 'react-bootstrap/Pagination'
import Table from 'react-bootstrap/Table'
import { Link, useNavigate } from 'react-router'
import { errorMessage } from '../../api'
import { useCharactersPage } from '../../queries/characters'

const PAGE_SIZE = 5

export default function CharacterList() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const characters = useCharactersPage({ limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE })
  const rows = characters.data?.items ?? []
  const pageCount = Math.ceil((characters.data?.total_count ?? 0) / PAGE_SIZE)
  const visiblePages = Array.from({ length: pageCount }, (_, index) => index + 1).slice(
    page - 1,
    page + 5,
  )

  return (
    <div id="characters">
      <Breadcrumb>
        <Breadcrumb.Item active>Characters</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h1 className="h4 mb-0">All Characters</h1>
          <Link to="/character/create" className="btn btn-info btn-sm">
            Add New Character
          </Link>
        </Card.Header>
        <Card.Body>
          {characters.isError && <Alert variant="danger">{errorMessage(characters.error)}</Alert>}
          <Table hover className="align-middle">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Image</th>
                <th scope="col">Name</th>
                <th scope="col" className="text-center">
                  HP
                </th>
                <th scope="col" className="text-center">
                  Attack
                </th>
                <th scope="col" className="text-center">
                  Defense
                </th>
                <th scope="col" className="text-center">
                  Sp. Atk
                </th>
                <th scope="col" className="text-center">
                  Sp. Def
                </th>
                <th scope="col" className="text-center">
                  Speed
                </th>
                <th scope="col" className="text-center">
                  Total
                </th>
                <th scope="col" className="text-center">
                  Generation
                </th>
                <th scope="col">Types</th>
                <th scope="col" className="text-center">
                  Evolution
                </th>
                <th scope="col">Name ID</th>
              </tr>
            </thead>
            <tbody>
              {characters.isLoading && (
                <tr>
                  <td colSpan={14}>Loading…</td>
                </tr>
              )}
              {rows.map((character) => (
                <tr
                  key={character.character_id}
                  onClick={() => navigate(`/character/edit/${character.character_id}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') navigate(`/character/edit/${character.character_id}`)
                  }}
                  tabIndex={0}
                >
                  <td className="text-center">{character.character_id}</td>
                  <td>
                    {character.image_url && (
                      <img src={character.image_url} alt={character.name} width={80} height={80} />
                    )}
                  </td>
                  <td>{character.name}</td>
                  <td className="text-center">{character.hp}</td>
                  <td className="text-center">{character.attack}</td>
                  <td className="text-center">{character.defense}</td>
                  <td className="text-center">{character.special_attack}</td>
                  <td className="text-center">{character.special_defense}</td>
                  <td className="text-center">{character.speed}</td>
                  <td className="text-center">{character.total}</td>
                  <td className="text-center">{character.generation}</td>
                  <td>{(character.types ?? []).join(', ')}</td>
                  <td className="text-center">{character.evolves_from_id}</td>
                  <td>{character.name_id}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer>
          <nav aria-label="character list pagination">
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

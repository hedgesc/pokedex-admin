import { http, HttpResponse } from 'msw'
import { api, server } from '../test/server'
import { ApiError, buildUrl, request } from './http'

describe('buildUrl', () => {
  it('joins the path onto the API URL and adds query params', () => {
    expect(buildUrl('moves', { limit: 8, offset: 0, skip: undefined })).toBe(
      'http://localhost:3000/moves?limit=8&offset=0',
    )
  })
})

describe('request', () => {
  it('parses JSON responses', async () => {
    server.use(http.get(api('games'), () => HttpResponse.json([{ game_id: 1 }])))
    await expect(request('games')).resolves.toEqual([{ game_id: 1 }])
  })

  it('returns text responses as strings', async () => {
    server.use(http.delete(api('games/1'), () => HttpResponse.text('Game 1 deleted')))
    await expect(request('games/1', { method: 'DELETE' })).resolves.toBe('Game 1 deleted')
  })

  it('sends the body as JSON', async () => {
    let received: unknown
    server.use(
      http.post(api('games'), async ({ request: req }) => {
        received = await req.json()
        return HttpResponse.text('created')
      }),
    )
    await request('games', { method: 'POST', body: { name: 'Red' } })
    expect(received).toEqual({ name: 'Red' })
  })

  it('throws ApiError with the response text on failure', async () => {
    server.use(http.get(api('games/9'), () => HttpResponse.text('Not found', { status: 404 })))
    const error = await request('games/9').catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 404, message: 'Not found' })
  })

  it('uses a JSON error message when there is one', async () => {
    server.use(
      http.get(api('games/9'), () => HttpResponse.json({ message: 'Bad id' }, { status: 400 })),
    )
    await expect(request('games/9')).rejects.toMatchObject({ status: 400, message: 'Bad id' })
  })

  it('falls back to a generic message when the error body is empty', async () => {
    server.use(http.get(api('games'), () => new HttpResponse(null, { status: 500 })))
    await expect(request('games')).rejects.toMatchObject({
      message: 'GET games failed with status 500',
    })
  })
})

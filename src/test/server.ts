import { setupServer } from 'msw/node'

// Mock API server for tests. Each test adds the handlers it needs with server.use(...).
export const server = setupServer()

/** Builds a full API URL for an MSW handler, e.g. api('games/3'). */
export const api = (path: string) => `http://localhost:3000/${path}`

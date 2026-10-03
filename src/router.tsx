import { createHashRouter } from 'react-router'
import { routes } from './routes'

// Hash routing keeps the same #/... URLs as the Vue app, so existing
// bookmarks keep working and no server-side fallback is needed.
export const router = createHashRouter(routes)

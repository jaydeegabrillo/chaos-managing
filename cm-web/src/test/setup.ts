import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest'
import { db, server } from './server'

// jsdom doesn't implement scrolling; ScrollRestoration calls it on every navigation.
window.scrollTo = () => {}

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
beforeEach(() => db.reset())
afterEach(() => {
  cleanup()
  server.resetHandlers()
})
afterAll(() => server.close())

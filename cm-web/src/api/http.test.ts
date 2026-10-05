import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '@/test/server'
import { API_URL, ApiError, errorMessages, parseErrorMessages, request } from './http'

describe('parseErrorMessages', () => {
  it('reads validation errors from { errors: string[] }', () => {
    expect(parseErrorMessages({ errors: ['Project Name is required.', 'Status must be valid.'] }, 400)).toEqual([
      'Project Name is required.',
      'Status must be valid.',
    ])
  })

  it('reads a single message from { error: string }', () => {
    expect(parseErrorMessages({ error: 'Project not found.' }, 404)).toEqual(['Project not found.'])
  })

  it('falls back to a generic message for unknown bodies', () => {
    expect(parseErrorMessages(null, 502)).toEqual(['The server returned an unexpected error (status 502).'])
    expect(parseErrorMessages({ errors: [] }, 400)).toEqual(['The server returned an unexpected error (status 400).'])
  })
})

describe('request', () => {
  it('throws an ApiError carrying the status and messages', async () => {
    server.use(http.get(`${API_URL}/boom`, () => HttpResponse.json({ error: 'Nope.' }, { status: 400 })))
    const error = await request('/boom').catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 400, messages: ['Nope.'] })
  })

  it('returns undefined for 204 responses', async () => {
    server.use(http.delete(`${API_URL}/thing`, () => new HttpResponse(null, { status: 204 })))
    await expect(request('/thing', { method: 'DELETE' })).resolves.toBeUndefined()
  })

  it('turns network failures into a readable ApiError', async () => {
    server.use(http.get(`${API_URL}/down`, () => HttpResponse.error()))
    const error = await request('/down').catch((e: unknown) => e)
    expect(errorMessages(error)).toEqual(['Could not reach the server. Check that cm-api is running and try again.'])
  })
})

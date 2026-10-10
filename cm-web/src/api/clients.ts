import { request } from '@/api/http'
import type { Client } from '@/features/projects/types'

export function listClients(signal?: AbortSignal) {
  return request<Client[]>('/clients', { signal })
}

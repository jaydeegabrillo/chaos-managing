// cm-api has no client endpoints yet, so the client list mirrors
// cm-api/database/seeders/20261004000000-seed-clients.js (ids assume a freshly seeded database).
// Swap this for a `GET /clients` query once that endpoint exists.
export interface ClientOption {
  id: number
  name: string
}

export const CLIENTS: readonly ClientOption[] = [
  { id: 1, name: 'Acme Corporation' },
  { id: 2, name: 'GreenLeaf Cafe' },
  { id: 3, name: 'Bright Realty' },
  { id: 4, name: 'Nova Fitness' },
  { id: 5, name: 'HealthFirst Clinic' },
]

const clientNames = new Map(CLIENTS.map((client) => [client.id, client.name]))

export function getClientName(id: number): string {
  return clientNames.get(id) ?? `Client #${id}`
}

/** Client options for a select, including `currentId` even if it is not a known client. */
export function getClientOptions(currentId?: number): readonly ClientOption[] {
  if (currentId === undefined || clientNames.has(currentId)) return CLIENTS
  return [...CLIENTS, { id: currentId, name: getClientName(currentId) }]
}

import { queryOptions, useQuery } from '@tanstack/react-query'
import { listClients } from '@/api/clients'

export const clientKeys = {
  all: ['clients'] as const,
  list: () => [...clientKeys.all, 'list'] as const,
}

export const clientsQueryOptions = () =>
  queryOptions({
    queryKey: clientKeys.list(),
    queryFn: ({ signal }) => listClients(signal),
  })

export function useClients() {
  return useQuery(clientsQueryOptions())
}

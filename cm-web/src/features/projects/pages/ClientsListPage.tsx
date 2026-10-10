import { ArrowDown, ArrowUp, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { errorMessages } from '@/api/http'
import { Button } from '@/components/ui/button'
import { ErrorPanel } from '@/components/ui/error-panel'
import { cn } from '@/lib/cn'
import { useClients } from '../clientQueries'
import type { Client, ClientStatus } from '../types'

const statusStyles: Record<ClientStatus, string> = {
  Active: 'border-[#bfe3c8] bg-[#e3f5e7] text-[#2f7d46]',
  Inactive: 'border-line bg-canvas text-muted',
}

const revenueFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const formatClientId = (id: number) => `#C${String(id).padStart(3, '0')}`

function matchesQuery(client: Client, query: string) {
  return client.name.toLowerCase().includes(query) || formatClientId(client.id).toLowerCase().includes(query)
}

const HEADERS = ['Client ID', 'Status', 'Active Projects', 'Revenue']

function ClientsTableSkeleton() {
  return (
    <div aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="h-14 animate-pulse border-t border-line bg-canvas/60 first:border-t-0" />
      ))}
    </div>
  )
}

export default function ClientsListPage() {
  const { data: clients, error, isPending, refetch, isRefetching } = useClients()
  const [query, setQuery] = useState('')
  const [dir, setDir] = useState<'asc' | 'desc'>('asc')
  const [selected, setSelected] = useState<ReadonlySet<number>>(new Set())

  const normalizedQuery = query.trim().toLowerCase()
  const visibleClients = useMemo(() => {
    const all = clients ?? []
    const matches = normalizedQuery ? all.filter((client) => matchesQuery(client, normalizedQuery)) : all
    const sorted = [...matches].sort((a, b) => a.name.localeCompare(b.name))
    return dir === 'asc' ? sorted : sorted.reverse()
  }, [clients, normalizedQuery, dir])

  const allSelected = visibleClients.length > 0 && visibleClients.every((client) => selected.has(client.id))

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(visibleClients.map((client) => client.id)))
  }

  function toggleOne(id: number) {
    setSelected((current) => {
      const next = new Set(current)
      if (!next.delete(id)) next.add(id)
      return next
    })
  }

  const SortIcon = dir === 'asc' ? ArrowUp : ArrowDown
  const count = clients?.length ?? 0

  return (
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Clients</h1>
          <p className="mt-1 text-sm text-muted">
            {isPending ? 'Loading clients…' : `${count} ${count === 1 ? 'client' : 'clients'}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="relative block w-full sm:w-64">
            <span className="sr-only">Search clients</span>
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search clients…"
              className="h-10 w-full rounded-lg border border-line bg-surface pr-3 pl-9 text-sm outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>
          <Button disabled title="Adding clients isn’t available yet" className="bg-ink hover:bg-ink">
            Add Client
          </Button>
        </div>
      </header>

      <p className="mt-6 rounded-lg border border-line bg-surface px-4 py-3 text-sm">
        Showing seeded data. (Production system pending).
      </p>

      {error ? (
        <ErrorPanel
          className="mt-4"
          title="Couldn’t load clients"
          messages={errorMessages(error)}
          action={
            <Button variant="secondary" size="sm" onClick={() => void refetch()} disabled={isRefetching}>
              Try again
            </Button>
          }
        />
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-surface shadow-[0_1px_3px_rgba(37,36,35,0.04)]">
          {isPending ? (
            <ClientsTableSkeleton />
          ) : visibleClients.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <h2 className="font-display font-semibold">No clients found</h2>
              <p className="mt-1 text-sm text-muted">Try another name or client number.</p>
            </div>
          ) : (
            <table className="w-full min-w-[40rem] text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-ink">
                  <th scope="col" className="w-12 py-3.5 pr-0 pl-4">
                    <input
                      type="checkbox"
                      aria-label="Select all clients"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="size-4 rounded border-line accent-primary"
                    />
                  </th>
                  <th scope="col" aria-sort={dir === 'asc' ? 'ascending' : 'descending'} className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => setDir((current) => (current === 'asc' ? 'desc' : 'asc'))}
                      className="inline-flex items-center gap-1.5 rounded-sm"
                    >
                      Client Name
                      <SortIcon className="size-3.5 text-muted" aria-hidden="true" />
                    </button>
                  </th>
                  {HEADERS.map((header) => (
                    <th key={header} scope="col" className="px-4 py-3.5">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleClients.map((client) => (
                  <tr
                    key={client.id}
                    className={cn(
                      'border-t border-line transition-colors hover:bg-canvas/70',
                      selected.has(client.id) && 'bg-canvas/70',
                    )}
                  >
                    <td className="py-4 pr-0 pl-4">
                      <input
                        type="checkbox"
                        aria-label={`Select ${client.name}`}
                        checked={selected.has(client.id)}
                        onChange={() => toggleOne(client.id)}
                        className="size-4 rounded border-line accent-primary"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-2">
                        {client.name}
                        {client.isNew ? (
                          <span className="rounded border border-[#b9d6f2] bg-[#e6f1fc] px-1.5 py-px text-[10px] font-semibold tracking-wide text-[#2a6cb0]">
                            NEW
                          </span>
                        ) : null}
                      </span>
                    </td>
                    <td className="px-4 py-4">{formatClientId(client.id)}</td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          'inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium',
                          statusStyles[client.status],
                        )}
                      >
                        {client.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">{client.activeProjects}</td>
                    <td className="px-4 py-4">{revenueFormat.format(client.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

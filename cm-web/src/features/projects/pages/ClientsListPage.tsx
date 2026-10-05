import { CLIENTS } from '../clients'

export default function ClientsListPage() {
  return (
    <>
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Clients</h1>
        <p className="mt-1 text-sm text-muted">{CLIENTS.length} clients</p>
      </div>

      <p className="mt-6 rounded-lg border border-line bg-surface px-4 py-3 text-sm text-muted">
        This directory uses the seeded client list. Live client management isn’t available yet.
      </p>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {CLIENTS.map((client) => (
          <li key={client.id} className="rounded-lg border border-line bg-surface px-5 py-4">
            <h2 className="font-medium">{client.name}</h2>
            <p className="mt-1 text-sm text-muted">Client #{client.id}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

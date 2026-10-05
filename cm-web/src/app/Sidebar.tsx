import { FolderKanban, UsersRound } from 'lucide-react'
import { Link, NavLink } from 'react-router'

const navigationItems = [
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/clients', label: 'Clients', icon: UsersRound },
]

export function Sidebar() {
  return (
    <aside className="row-start-2 border-b border-line bg-surface p-4 lg:row-start-1 lg:row-span-2 lg:min-h-dvh lg:border-r lg:border-b-0">
      <Link to="/projects" className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight">
        <span className="grid size-7 place-items-center rounded-md bg-primary text-sm text-white" aria-hidden="true">
          cm
        </span>
        Chaos Managing
      </Link>
      <nav aria-label="Main navigation" className="mt-5 lg:sticky lg:top-4">
        <ul className="flex gap-2 overflow-x-auto lg:flex-col">
          {navigationItems.map(({ to, label, icon: Icon }) => (
            <li key={to} className="shrink-0">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-primary text-white' : 'text-muted hover:bg-canvas hover:text-ink'
                  }`
                }
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

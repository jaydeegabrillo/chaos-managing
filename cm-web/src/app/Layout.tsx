import { ChevronRight, LayoutGrid } from 'lucide-react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { Sidebar } from './Sidebar'

export function Layout() {
  const { pathname } = useLocation()
  const currentPage = pathname.startsWith('/clients') ? 'Clients' : 'Projects'

  return (
    <div className="grid min-h-dvh grid-cols-1 grid-rows-[auto_auto_1fr] lg:grid-cols-[15%_minmax(0,1fr)] lg:grid-rows-[auto_minmax(0,1fr)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <Sidebar />
      <header className="row-start-1 border-b border-line/80 bg-surface/90 lg:col-start-2">
        <div className="flex h-[66px] items-center gap-2 px-5 sm:px-8">
          <LayoutGrid className="size-4 text-muted" aria-hidden="true" />
          <span className="text-sm font-medium text-muted">Workspace</span>
          <ChevronRight className="size-3.5 text-muted/60" aria-hidden="true" />
          <span className="text-sm font-semibold text-ink">{currentPage}</span>
        </div>
      </header>
      <main id="main" className="row-start-3 w-full px-5 py-8 sm:px-8 sm:py-10 lg:col-start-2 lg:row-start-2 lg:px-10 xl:px-12">
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  )
}

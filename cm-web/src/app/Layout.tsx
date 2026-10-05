import { Outlet, ScrollRestoration } from 'react-router'
import { Sidebar } from './Sidebar'

export function Layout() {
  return (
    <div className="grid min-h-dvh grid-cols-1 grid-rows-[auto_auto_1fr] lg:grid-cols-[15%_minmax(0,1fr)] lg:grid-rows-[auto_minmax(0,1fr)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <Sidebar />
      <header className="row-start-1 border-b border-line bg-surface lg:col-start-2">
        <div className="h-[66px]" />
      </header>
      <main id="main" className="row-start-3 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:col-start-2 lg:row-start-2">
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  )
}

import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'

type FormPageLayoutProps = {
  title: string
  description?: string
  aside?: ReactNode
  children: ReactNode
}

export function FormPageLayout({ title, description, aside, children }: FormPageLayoutProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/projects" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ChevronLeft className="size-4" aria-hidden="true" />
        All projects
      </Link>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
          {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
        </div>
        {aside}
      </div>
      <div className="mt-8 rounded-lg border border-line bg-surface p-6 sm:p-8">{children}</div>
    </div>
  )
}

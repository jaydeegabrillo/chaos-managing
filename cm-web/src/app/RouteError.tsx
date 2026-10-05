import { isRouteErrorResponse, useRouteError } from 'react-router'
import { ErrorPanel } from '@/components/ui/error-panel'
import { Button } from '@/components/ui/button'
import { NotFound } from './NotFound'

/** Catches render errors and failed lazy-route loads so the whole app doesn't go blank. */
export function RouteError() {
  const error = useRouteError()

  if (isRouteErrorResponse(error) && error.status === 404) return <NotFound />

  return (
    <div className="mx-auto max-w-xl py-16">
      <ErrorPanel
        title="Something went wrong on this page."
        messages={[error instanceof Error ? error.message : 'An unexpected error occurred.']}
        action={
          <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>
            Reload page
          </Button>
        }
      />
    </div>
  )
}

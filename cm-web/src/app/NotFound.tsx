import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

type NotFoundProps = {
  title?: string
  message?: string
}

export function NotFound({ title = 'Page not found', message = 'The page you’re looking for doesn’t exist.' }: NotFoundProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <p className="font-display text-6xl font-bold text-line">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-muted">{message}</p>
      <Button asChild variant="secondary" className="mt-6">
        <Link to="/projects">Go to projects</Link>
      </Button>
    </div>
  )
}

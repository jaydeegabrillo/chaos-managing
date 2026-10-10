import { TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type ErrorPanelProps = {
  title: string
  messages?: string[]
  action?: ReactNode
  className?: string
}

export function ErrorPanel({ title, messages = [], action, className }: ErrorPanelProps) {
  return (
    <div role="alert" className={cn('flex gap-3 rounded-md border border-danger/30 bg-danger/5 p-4 text-sm', className)}>
      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden="true" />
      <div className="flex-1">
        <p className="font-medium text-danger">{title}</p>
        {messages.length > 0 ? (
          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-ink">
            {messages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        ) : null}
        {action ? <div className="mt-3">{action}</div> : null}
      </div>
    </div>
  )
}

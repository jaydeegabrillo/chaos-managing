import { cn } from '@/lib/cn'
import { statusColor } from '../status'
import { PROJECT_PRIORITIES, type ProjectPriority, type ProjectStatus } from '../types'

export function StatusIndicator({ status }: { status: ProjectStatus }) {
  const statusBadge: Record<ProjectStatus, string> = {
    Planning: 'bg-status-planning/10 text-status-planning',
    'In Progress': 'bg-status-progress/10 text-status-progress',
    'On Hold': 'bg-status-hold/10 text-status-hold',
    Completed: 'bg-status-done/10 text-status-done',
  }

  return (
    <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium', statusBadge[status])}>
      <span className={cn('size-1.5 rounded-full', statusColor[status])} aria-hidden="true" />
      {status}
    </span>
  )
}

/** Priority as a three-step meter so it scans faster than repeated text. */
export function PriorityMeter({ priority }: { priority: ProjectPriority }) {
  const level = PROJECT_PRIORITIES.indexOf(priority) + 1
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm" title={`${priority} priority`}>
      <span className="flex items-end gap-0.5" aria-hidden="true">
        {PROJECT_PRIORITIES.map((p, i) => (
          <span
            key={p}
            className={cn(
              'w-1 rounded-sm',
              i === 0 ? 'h-2' : i === 1 ? 'h-3' : 'h-4',
              i < level ? (level === 3 ? 'bg-warning' : 'bg-ink') : 'bg-line',
            )}
          />
        ))}
      </span>
      {priority}
    </span>
  )
}

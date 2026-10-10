import { daysBetween, formatDate, parseDateOnly } from '@/lib/dates'
import { cn } from '@/lib/cn'
import type { Project } from '../types'
import { statusColor } from '../status'

type ScheduleRailProps = {
  project: Pick<Project, 'startDate' | 'dueDate' | 'status'>
  today: Date
}

function dueLabel(project: ScheduleRailProps['project'], today: Date): { text: string; overdue: boolean } | null {
  if (!project.dueDate) return null
  if (project.status === 'Completed') return { text: 'Done', overdue: false }
  const days = daysBetween(today, parseDateOnly(project.dueDate))
  if (days < 0) return { text: `${-days} ${-days === 1 ? 'day' : 'days'} overdue`, overdue: true }
  if (days === 0) return { text: 'Due today', overdue: false }
  return { text: `${days} ${days === 1 ? 'day' : 'days'} left`, overdue: false }
}

/** Date range plus a rail showing how much of the schedule has elapsed. */
export function ScheduleRail({ project, today }: ScheduleRailProps) {
  const { startDate, dueDate, status } = project
  if (!startDate && !dueDate) return <span className="text-sm text-muted">No dates set</span>

  const label = dueLabel(project, today)
  let elapsed: number | null = null
  if (startDate && dueDate) {
    const total = daysBetween(parseDateOnly(startDate), parseDateOnly(dueDate))
    const done = daysBetween(parseDateOnly(startDate), today)
    elapsed = total <= 0 ? (done >= 0 ? 1 : 0) : Math.min(Math.max(done / total, 0), 1)
  }

  return (
    <div className="flex min-w-44 flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="whitespace-nowrap tabular-nums">
          {startDate ? formatDate(startDate, today) : 'No start'}
          <span className="text-muted"> to </span>
          {dueDate ? formatDate(dueDate, today) : 'no due date'}
        </span>
        {label ? (
          <span className={cn('whitespace-nowrap text-xs', label.overdue ? 'font-semibold text-warning' : 'text-muted')}>
            {label.text}
          </span>
        ) : null}
      </div>
      {elapsed !== null ? (
        <div className="h-1 overflow-hidden rounded-full bg-line" aria-hidden="true">
          <div
            className={cn('h-full rounded-full', label?.overdue ? 'bg-warning' : statusColor[status])}
            style={{ width: `${status === 'Completed' ? 100 : Math.round(elapsed * 100)}%` }}
          />
        </div>
      ) : null}
    </div>
  )
}

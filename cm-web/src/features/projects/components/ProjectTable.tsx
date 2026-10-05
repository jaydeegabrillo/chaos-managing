import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
import { memo } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import { getClientName } from '../clients'
import type { SortDir, SortField } from '../filtering'
import type { Project } from '../types'
import { PriorityMeter, StatusIndicator } from './ProjectMeta'
import { ScheduleRail } from './ScheduleRail'

type ProjectTableProps = {
  projects: Project[]
  today: Date
  sort: SortField
  dir: SortDir
  onSort: (field: SortField) => void
  onDelete: (project: Project) => void
  onEdit: (project: Project) => void
}

const COLUMNS: { field: SortField; label: string; className?: string }[] = [
  { field: 'projectName', label: 'Project' },
  { field: 'client', label: 'Client' },
  { field: 'status', label: 'Status' },
  { field: 'priority', label: 'Priority' },
  { field: 'dueDate', label: 'Schedule', className: 'w-64' },
]

function SortHeader({
  field,
  label,
  className,
  sort,
  dir,
  onSort,
}: (typeof COLUMNS)[number] & Pick<ProjectTableProps, 'sort' | 'dir' | 'onSort'>) {
  const active = sort === field
  const Icon = active ? (dir === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown
  return (
    <th
      scope="col"
      aria-sort={active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'}
      className={cn('px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide', className)}
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-sm hover:text-ink',
          active ? 'text-ink' : 'text-muted',
        )}
      >
        {label}
        <Icon className={cn('size-3.5', active ? 'opacity-100' : 'opacity-40')} aria-hidden="true" />
      </button>
    </th>
  )
}

const ProjectRow = memo(function ProjectRow({
  project,
  today,
  onDelete,
  onEdit,
}: {
  project: Project
  today: Date
  onDelete: (project: Project) => void
  onEdit: (project: Project) => void
}) {
  return (
    <tr className="border-t border-line align-top transition-colors hover:bg-canvas/60">
      <td className="max-w-80 px-4 py-4.5">
        <Link
          to={`/projects/${project.id}/edit`}
          className="font-display text-base font-semibold text-ink underline-offset-4 hover:underline"
        >
          {project.projectName}
        </Link>
        {project.description ? <p className="mt-1 line-clamp-2 text-sm text-muted">{project.description}</p> : null}
      </td>
      <td className="whitespace-nowrap px-4 py-4.5 text-sm text-muted">{getClientName(project.clientId)}</td>
      <td className="px-4 py-4.5">
        <StatusIndicator status={project.status} />
      </td>
      <td className="px-4 py-4.5">
        <PriorityMeter priority={project.priority} />
      </td>
      <td className="px-4 py-4.5">
        <ScheduleRail project={project} today={today} />
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" aria-label={`Edit ${project.projectName}`} onClick={() => onEdit(project)}>
            <Pencil aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-danger/10 hover:text-danger"
            aria-label={`Delete ${project.projectName}`}
            onClick={() => onDelete(project)}
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
      </td>
    </tr>
  )
})

export function ProjectTable({ projects, today, sort, dir, onSort, onDelete, onEdit }: ProjectTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[56rem] border-collapse text-sm">
        <thead className="bg-canvas/70">
          <tr>
            {COLUMNS.map((column) => (
              <SortHeader key={column.field} {...column} sort={sort} dir={dir} onSort={onSort} />
            ))}
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <ProjectRow key={project.id} project={project} today={today} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ProjectTableSkeleton() {
  return (
    <div className="rounded-lg border border-line bg-surface" aria-busy="true" aria-label="Loading projects">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-6 border-t border-line px-4 py-5 first:border-t-0">
          <div className="h-4 w-1/4 rounded bg-line" />
          <div className="h-3 w-1/6 rounded bg-line" />
          <div className="h-3 w-20 rounded bg-line" />
          <div className="h-3 w-16 rounded bg-line" />
          <div className="h-2 flex-1 rounded bg-line" />
        </div>
      ))}
    </div>
  )
}

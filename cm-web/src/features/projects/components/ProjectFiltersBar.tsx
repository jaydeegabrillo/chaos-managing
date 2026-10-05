import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Select } from '@/components/ui/fields'
import { hasActiveFilters, type ProjectFilters } from '../filtering'
import { PROJECT_PRIORITIES, PROJECT_STATUSES } from '../types'

type ProjectFiltersBarProps = {
  filters: ProjectFilters
  onChange: (patch: Partial<ProjectFilters>) => void
  onClear: () => void
}

export function ProjectFiltersBar({ filters, onChange, onClear }: ProjectFiltersBarProps) {
  return (
    <div role="search" className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <Input
          type="search"
          aria-label="Search projects"
          placeholder="Search by project, client or description"
          className="pl-9"
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
        />
      </div>
      <div className="flex gap-3">
        <Select
          aria-label="Filter by status"
          className="sm:w-40"
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value as ProjectFilters['status'] })}
        >
          <option value="">All statuses</option>
          {PROJECT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Filter by priority"
          className="sm:w-40"
          value={filters.priority}
          onChange={(e) => onChange({ priority: e.target.value as ProjectFilters['priority'] })}
        >
          <option value="">All priorities</option>
          {PROJECT_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </Select>
        {hasActiveFilters(filters) ? (
          <Button variant="ghost" onClick={onClear}>
            <X aria-hidden="true" />
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  )
}

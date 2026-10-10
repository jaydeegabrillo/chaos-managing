import { getClientName } from './clients'
import {
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
  type Project,
  type ProjectPriority,
  type ProjectStatus,
} from './types'

export const SORT_FIELDS = ['dueDate', 'startDate', 'projectName', 'client', 'status', 'priority'] as const
export type SortField = (typeof SORT_FIELDS)[number]
export type SortDir = 'asc' | 'desc'

export interface ProjectFilters {
  q: string
  status: ProjectStatus | ''
  priority: ProjectPriority | ''
  sort: SortField
  dir: SortDir
}

export const DEFAULT_FILTERS: ProjectFilters = { q: '', status: '', priority: '', sort: 'dueDate', dir: 'asc' }

function oneOf<T extends string>(values: readonly T[], value: string | null): value is T {
  return value !== null && (values as readonly string[]).includes(value)
}

/** Reads filters from the URL, falling back to defaults for anything missing or invalid. */
export function readFilters(params: URLSearchParams): ProjectFilters {
  const status = params.get('status')
  const priority = params.get('priority')
  const sort = params.get('sort')
  return {
    q: params.get('q') ?? '',
    status: oneOf(PROJECT_STATUSES, status) ? status : '',
    priority: oneOf(PROJECT_PRIORITIES, priority) ? priority : '',
    sort: oneOf(SORT_FIELDS, sort) ? sort : DEFAULT_FILTERS.sort,
    dir: params.get('dir') === 'desc' ? 'desc' : 'asc',
  }
}

/** Writes filters to URL params, omitting defaults so URLs stay short. */
export function writeFilters(filters: ProjectFilters): URLSearchParams {
  const params = new URLSearchParams()
  for (const key of Object.keys(DEFAULT_FILTERS) as (keyof ProjectFilters)[]) {
    const value = filters[key].trim()
    if (value && value !== DEFAULT_FILTERS[key]) params.set(key, value)
  }
  return params
}

export function hasActiveFilters(filters: ProjectFilters): boolean {
  return filters.q.trim() !== '' || filters.status !== '' || filters.priority !== ''
}

const rank = <T extends string>(values: readonly T[]) => new Map(values.map((v, i) => [v, i]))
const statusRank = rank(PROJECT_STATUSES)
const priorityRank = rank(PROJECT_PRIORITIES)
const collator = new Intl.Collator(undefined, { sensitivity: 'base', numeric: true })

function sortValue(project: Project, field: SortField): string | number | null {
  switch (field) {
    case 'dueDate':
      return project.dueDate
    case 'startDate':
      return project.startDate
    case 'projectName':
      return project.projectName
    case 'client':
      return getClientName(project.clientId)
    case 'status':
      return statusRank.get(project.status) ?? 0
    case 'priority':
      return priorityRank.get(project.priority) ?? 0
  }
}

export function filterAndSortProjects(projects: readonly Project[], filters: ProjectFilters): Project[] {
  const query = filters.q.trim().toLowerCase()
  const factor = filters.dir === 'asc' ? 1 : -1

  return projects
    .filter((project) => {
      if (filters.status && project.status !== filters.status) return false
      if (filters.priority && project.priority !== filters.priority) return false
      if (!query) return true
      return (
        project.projectName.toLowerCase().includes(query) ||
        getClientName(project.clientId).toLowerCase().includes(query) ||
        (project.description?.toLowerCase().includes(query) ?? false)
      )
    })
    .sort((a, b) => {
      const av = sortValue(a, filters.sort)
      const bv = sortValue(b, filters.sort)
      // Missing values always sink to the bottom, whatever the direction.
      if (av === null || bv === null) return av === bv ? a.id - b.id : av === null ? 1 : -1
      const diff = typeof av === 'number' && typeof bv === 'number' ? av - bv : collator.compare(String(av), String(bv))
      return diff === 0 ? a.id - b.id : diff * factor
    })
}

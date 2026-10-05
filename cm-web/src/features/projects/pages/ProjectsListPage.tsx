import { FolderPlus, Plus } from 'lucide-react'
import { lazy, Suspense, useDeferredValue, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { ErrorPanel } from '@/components/ui/error-panel'
import { errorMessages } from '@/api/http'
import { daysBetween, parseDateOnly, startOfToday } from '@/lib/dates'
import { DeleteProjectDialog } from '../components/DeleteProjectDialog'
import { ProjectFiltersBar } from '../components/ProjectFiltersBar'
import { ProjectTable, ProjectTableSkeleton } from '../components/ProjectTable'
import { DEFAULT_FILTERS, filterAndSortProjects, readFilters, writeFilters, type ProjectFilters, type SortField } from '../filtering'
import { useProjects } from '../queries'
import type { Project } from '../types'

const ProjectEditDialog = lazy(() => import('../components/ProjectEditDialog'))
const LazyProjectCreateDialog = lazy(() =>
  import('../components/ProjectCreateDialog').then((module) => ({ default: module.ProjectCreateDialog })),
)

export default function ProjectsListPage() {
  const { data: projects, error, isPending, refetch, isRefetching } = useProjects()
  const [searchParams, setSearchParams] = useSearchParams()
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null)
  const [hasOpenedEdit, setHasOpenedEdit] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [hasOpenedCreate, setHasOpenedCreate] = useState(false)
  const [today] = useState(startOfToday)

  const filters = readFilters(searchParams)
  // Keep typing responsive: filter against a deferred copy of the query.
  const deferredQuery = useDeferredValue(filters.q)
  const { status, priority, sort, dir } = filters

  const visibleProjects = useMemo(
    () => filterAndSortProjects(projects ?? [], { q: deferredQuery, status, priority, sort, dir }),
    [projects, deferredQuery, status, priority, sort, dir],
  )

  const overdueCount = useMemo(
    () =>
      (projects ?? []).filter(
        (p) => p.dueDate && p.status !== 'Completed' && daysBetween(today, parseDateOnly(p.dueDate)) < 0,
      ).length,
    [projects, today],
  )

  function updateFilters(patch: Partial<ProjectFilters>) {
    setSearchParams(writeFilters({ ...filters, ...patch }), { replace: true })
  }

  function handleSort(field: SortField) {
    updateFilters({ sort: field, dir: sort === field && dir === 'asc' ? 'desc' : 'asc' })
  }

  function openCreateDialog() {
    setHasOpenedCreate(true)
    setIsCreateOpen(true)
  }

  function openEditDialog(project: Project) {
    setHasOpenedEdit(true)
    setProjectToEdit(project)
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Projects</h1>
          {projects ? (
            <p className="mt-1 text-sm text-muted">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'}
              {overdueCount > 0 ? (
                <>
                  , <span className="font-medium text-warning">{overdueCount} overdue</span>
                </>
              ) : null}
            </p>
          ) : null}
        </div>
        <Button onClick={openCreateDialog}>
          <Plus aria-hidden="true" />
          New project
        </Button>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <ProjectFiltersBar
          filters={filters}
          onChange={updateFilters}
          onClear={() => updateFilters({ ...DEFAULT_FILTERS, sort, dir })}
        />

        {isPending ? (
          <ProjectTableSkeleton />
        ) : error ? (
          <ErrorPanel
            title="Projects couldn’t be loaded."
            messages={errorMessages(error)}
            action={
              <Button variant="secondary" size="sm" onClick={() => refetch()} disabled={isRefetching}>
                {isRefetching ? 'Retrying…' : 'Try again'}
              </Button>
            }
          />
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center rounded-lg border border-dashed border-line bg-surface px-6 py-16 text-center">
            <FolderPlus className="size-8 text-muted" aria-hidden="true" />
            <h2 className="mt-4 font-display text-xl font-semibold">No projects yet</h2>
            <p className="mt-1 max-w-sm text-sm text-muted">Add your first client project to start tracking its status and deadlines.</p>
            <Button className="mt-6" onClick={openCreateDialog}>
              Create a project
            </Button>
          </div>
        ) : visibleProjects.length === 0 ? (
          <div className="rounded-lg border border-line bg-surface px-6 py-12 text-center">
            <p className="font-medium">No projects match these filters.</p>
            <Button variant="secondary" size="sm" className="mt-4" onClick={() => updateFilters({ ...DEFAULT_FILTERS, sort, dir })}>
              Clear filters
            </Button>
          </div>
        ) : (
          <ProjectTable
            projects={visibleProjects}
            today={today}
            sort={sort}
            dir={dir}
            onSort={handleSort}
            onDelete={setProjectToDelete}
            onEdit={openEditDialog}
          />
        )}
      </div>

      <DeleteProjectDialog project={projectToDelete} onClose={() => setProjectToDelete(null)} />
      <Suspense fallback={null}>
        {hasOpenedEdit ? (
          <ProjectEditDialog
            project={projectToEdit}
            open={projectToEdit !== null}
            onClose={() => setProjectToEdit(null)}
          />
        ) : null}
        {hasOpenedCreate ? <LazyProjectCreateDialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)} /> : null}
      </Suspense>
    </>
  )
}

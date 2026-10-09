import { FolderPlus, Plus } from 'lucide-react'
import { lazy, Suspense, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { ErrorPanel } from '@/components/ui/error-panel'
import { errorMessages } from '@/api/http'
import { daysBetween, parseDateOnly, startOfToday } from '@/lib/dates'
import { DeleteProjectDialog } from '../components/DeleteProjectDialog'
import { ProjectFiltersBar, ProjectSearchInput } from '../components/ProjectFiltersBar'
import { ProjectTable, ProjectTableSkeleton } from '../components/ProjectTable'
import { DEFAULT_FILTERS, filterAndSortProjects, readFilters, writeFilters, type ProjectFilters, type SortField } from '../filtering'
import { useProjects } from '../queries'
import type { Project } from '../types'

const EMPTY_PROJECTS: Project[] = []

const ProjectEditDialog = lazy(() => import('../components/ProjectEditDialog'))
const LazyProjectCreateDialog = lazy(() =>
  import('../components/ProjectCreateDialog').then((module) => ({ default: module.ProjectCreateDialog })),
)

export default function ProjectsListPage() {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedPage = Number(searchParams.get('page'))
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const { data: projectPage, error, isPending, refetch, isRefetching } = useProjects(page)
  const projects = projectPage?.data ?? EMPTY_PROJECTS
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null)
  const [hasOpenedEdit, setHasOpenedEdit] = useState(false)
  const [isTableUpdating, setIsTableUpdating] = useState(
    () =>
      typeof location.state === 'object' &&
      location.state !== null &&
      'showTableLoading' in location.state &&
      location.state.showTableLoading === true,
  )
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [hasOpenedCreate, setHasOpenedCreate] = useState(false)
  const [today] = useState(startOfToday)
  const totalPages = projectPage?.totalPages ?? 1

  useEffect(() => {
    if (!isTableUpdating) return
    const timeout = window.setTimeout(() => setIsTableUpdating(false), 2000)
    return () => window.clearTimeout(timeout)
  }, [isTableUpdating])

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

  useEffect(() => {
    if (projectPage && page > projectPage.totalPages) {
      const nextParams = new URLSearchParams(searchParams)
      if (projectPage.totalPages <= 1) nextParams.delete('page')
      else nextParams.set('page', String(projectPage.totalPages))
      setSearchParams(nextParams, { replace: true })
    }
  }, [page, projectPage, searchParams, setSearchParams])

  function updateFilters(patch: Partial<ProjectFilters>) {
    setSearchParams(writeFilters({ ...filters, ...patch }), { replace: true })
  }

  function setPage(nextPage: number) {
    const nextParams = new URLSearchParams(searchParams)
    if (nextPage <= 1) nextParams.delete('page')
    else nextParams.set('page', String(nextPage))
    setSearchParams(nextParams)
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
    <div className="flex min-h-full flex-col">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Projects</h1>
          {projectPage ? (
            <p className="mt-1 text-sm text-muted">
              {projectPage.totalItems} {projectPage.totalItems === 1 ? 'project' : 'projects'}
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

      <section aria-labelledby="project-filters-heading" className="mt-8 rounded-xl border border-line/80 bg-surface p-5 shadow-[0_1px_3px_rgba(37,36,35,0.04)] sm:p-6">
        <h2 id="project-filters-heading" className="mb-4 font-display text-sm font-semibold tracking-wide text-muted">
          Filters
        </h2>
        <ProjectFiltersBar
          filters={filters}
          onChange={updateFilters}
          onClear={() => updateFilters({ ...DEFAULT_FILTERS, sort, dir })}
        />
      </section>

      <section aria-labelledby="project-list-heading" className="mt-5 min-h-80 flex-1 overflow-hidden rounded-xl border border-line/80 bg-surface shadow-[0_1px_3px_rgba(37,36,35,0.04)]">
        <div className="flex flex-col gap-4 border-b border-line/80 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 id="project-list-heading" className="font-display text-lg font-semibold">
              Project list
            </h2>
            <p className="mt-0.5 text-xs text-muted">Keep track of work, ownership and timelines</p>
          </div>
          <div className="w-full sm:max-w-sm">
            <ProjectSearchInput query={filters.q} onChange={(q) => updateFilters({ q })} />
          </div>
        </div>
        {isPending || isTableUpdating ? (
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
        ) : projectPage?.totalItems === 0 ? (
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
          <div className="px-2 pb-2 sm:px-3">
            <ProjectTable
              projects={visibleProjects}
              today={today}
              sort={sort}
              dir={dir}
              onSort={handleSort}
              onDelete={setProjectToDelete}
              onEdit={openEditDialog}
            />
          </div>
        )}
        {projectPage && projectPage.totalItems > 0 ? (
          <div className="flex flex-col gap-3 border-t border-line/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-muted" aria-live="polite">
              Showing {(page - 1) * projectPage.limit + 1}–{Math.min(page * projectPage.limit, projectPage.totalItems)} of {projectPage.totalItems}
            </p>
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1 || isPending}
                aria-label="Go to previous page"
              >
                Previous
              </Button>
              <span className="text-sm text-muted" aria-label={`Page ${page} of ${totalPages}`}>
                Page {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages || isPending}
                aria-label="Go to next page"
              >
                Next
              </Button>
            </div>
          </div>
        ) : null}
      </section>

      <DeleteProjectDialog project={projectToDelete} onClose={() => setProjectToDelete(null)} />
      <Suspense fallback={null}>
        {hasOpenedEdit ? (
          <ProjectEditDialog
            project={projectToEdit}
            open={projectToEdit !== null}
            onClose={() => setProjectToEdit(null)}
            onUpdated={() => setIsTableUpdating(true)}
          />
        ) : null}
        {hasOpenedCreate ? <LazyProjectCreateDialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)} /> : null}
      </Suspense>
    </div>
  )
}

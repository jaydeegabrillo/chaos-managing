import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createProject, deleteProject, getProject, listProjects, updateProject } from '@/api/projects'
import type { ProjectInput, ProjectPage } from './types'

export const projectKeys = {
  all: ['projects'] as const,
  list: () => [...projectKeys.all, 'list'] as const,
  pagedList: (page: number, limit: number) => [...projectKeys.list(), page, limit] as const,
  detail: (id: number) => [...projectKeys.all, 'detail', id] as const,
}

export const PROJECTS_PAGE_SIZE = 10
const MIN_MUTATION_DURATION_MS = 2000

async function withMinimumMutationDuration<T>(operation: () => Promise<T>) {
  const startedAt = Date.now()
  const result = await operation()
  const remaining = MIN_MUTATION_DURATION_MS - (Date.now() - startedAt)
  if (remaining > 0) await new Promise<void>((resolve) => window.setTimeout(resolve, remaining))
  return result
}

export const projectsQueryOptions = (page = 1, limit = PROJECTS_PAGE_SIZE) =>
  queryOptions({
    queryKey: projectKeys.pagedList(page, limit),
    queryFn: ({ signal }) => listProjects(page, limit, signal),
  })

export function useProjects(page = 1) {
  return useQuery(projectsQueryOptions(page))
}

export function useProject(id: number, enabled = true) {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: ({ signal }) => getProject(id, signal),
    enabled,
    // Coming from the list, render the cached row immediately and refetch in the background.
    initialData: () =>
      queryClient
        .getQueriesData<ProjectPage>({ queryKey: projectKeys.list() })
        .flatMap(([, page]) => page?.data ?? [])
        .find((project) => project.id === id),
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ProjectInput) => withMinimumMutationDuration(() => createProject(input)),
    onSuccess: (project) => {
      queryClient.setQueryData(projectKeys.detail(project.id), project)
      return queryClient.invalidateQueries({ queryKey: projectKeys.list() })
    },
  })
}

export function useUpdateProject(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ProjectInput) => withMinimumMutationDuration(() => updateProject(id, input)),
    onSuccess: (project) => {
      queryClient.setQueryData(projectKeys.detail(id), project)
      return queryClient.invalidateQueries({ queryKey: projectKeys.list() })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => withMinimumMutationDuration(() => deleteProject(id)),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: projectKeys.detail(id) })
      return queryClient.invalidateQueries({ queryKey: projectKeys.list() })
    },
  })
}

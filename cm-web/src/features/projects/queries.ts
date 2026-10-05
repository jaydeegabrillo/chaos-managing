import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createProject, deleteProject, getProject, listProjects, updateProject } from '@/api/projects'
import type { Project, ProjectInput } from './types'

export const projectKeys = {
  all: ['projects'] as const,
  list: () => [...projectKeys.all, 'list'] as const,
  detail: (id: number) => [...projectKeys.all, 'detail', id] as const,
}

export const projectsQueryOptions = () =>
  queryOptions({
    queryKey: projectKeys.list(),
    queryFn: ({ signal }) => listProjects(signal),
  })

export function useProjects() {
  return useQuery(projectsQueryOptions())
}

export function useProject(id: number, enabled = true) {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: ({ signal }) => getProject(id, signal),
    enabled,
    // Coming from the list, render the cached row immediately and refetch in the background.
    initialData: () => queryClient.getQueryData<Project[]>(projectKeys.list())?.find((p) => p.id === id),
    initialDataUpdatedAt: () => queryClient.getQueryState(projectKeys.list())?.dataUpdatedAt,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ProjectInput) => createProject(input),
    onSuccess: (project) => {
      queryClient.setQueryData(projectKeys.detail(project.id), project)
      return queryClient.invalidateQueries({ queryKey: projectKeys.list() })
    },
  })
}

export function useUpdateProject(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ProjectInput) => updateProject(id, input),
    onSuccess: (project) => {
      queryClient.setQueryData(projectKeys.detail(id), project)
      return queryClient.invalidateQueries({ queryKey: projectKeys.list() })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteProject(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<Project[]>(projectKeys.list(), (old) => old?.filter((p) => p.id !== id))
      queryClient.removeQueries({ queryKey: projectKeys.detail(id) })
      return queryClient.invalidateQueries({ queryKey: projectKeys.list() })
    },
  })
}

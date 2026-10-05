import { request } from '@/api/http'
import type { Project, ProjectInput } from '@/features/projects/types'

export function listProjects(signal?: AbortSignal) {
  return request<Project[]>('/projects', { signal })
}

export function getProject(id: number, signal?: AbortSignal) {
  return request<Project>(`/projects/${id}`, { signal })
}

export function createProject(input: ProjectInput) {
  return request<Project>('/projects', { method: 'POST', body: JSON.stringify(input) })
}

export function updateProject(id: number, input: ProjectInput) {
  return request<Project>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(input) })
}

export function deleteProject(id: number) {
  return request<void>(`/projects/${id}`, { method: 'DELETE' })
}

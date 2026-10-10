import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { API_URL } from '@/api/http'
import type { Client, Project, ProjectInput } from '@/features/projects/types'

export function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 1,
    clientId: 1,
    projectName: 'Website Redesign',
    description: 'Refresh the marketing site.',
    status: 'In Progress',
    priority: 'High',
    startDate: '2026-09-01',
    dueDate: '2026-11-30',
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
    ...overrides,
  }
}

export const seededClients: Client[] = [
  ['Acme Corporation', 15200, 2, false],
  ['GreenLeaf Cafe', 9300, 1, false],
  ['Bright Realty', 10700, 1, true],
  ['Nova Fitness', 3800, 1, false],
  ['HealthFirst Clinic', 5600, 0, false],
].map(([name, revenue, activeProjects, isNew], index) => ({
  id: index + 1,
  name: name as string,
  contactPerson: null,
  email: null,
  phone: null,
  address: null,
  status: 'Active',
  revenue: revenue as number,
  isNew: isNew as boolean,
  activeProjects: activeProjects as number,
  createdAt: '2026-10-04T00:00:00.000Z',
  updatedAt: '2026-10-04T00:00:00.000Z',
}))

/** In-memory stand-in for cm-api, reset before every test. */
export const db = {
  projects: [] as Project[],
  reset(projects: Project[] = []) {
    this.projects = projects.map((p) => ({ ...p }))
  },
}

const url = (path: string) => `${API_URL}${path}`
const notFound = () => HttpResponse.json({ error: 'Project not found.' }, { status: 404 })

export const handlers = [
  http.get(url('/clients'), () => HttpResponse.json(seededClients)),

  http.get(url('/projects'), ({ request }) => {
    const search = new URL(request.url).searchParams
    const page = Number(search.get('page') ?? 1)
    const limit = Number(search.get('limit') ?? (db.projects.length || 1))
    const offset = (page - 1) * limit
    return HttpResponse.json({
      data: db.projects.slice(offset, offset + limit),
      page,
      limit,
      totalItems: db.projects.length,
      totalPages: Math.ceil(db.projects.length / limit) || 1,
    })
  }),

  http.get(url('/projects/:id'), ({ params }) => {
    const project = db.projects.find((p) => p.id === Number(params.id))
    return project ? HttpResponse.json(project) : notFound()
  }),

  http.post(url('/projects'), async ({ request }) => {
    const input = (await request.json()) as ProjectInput
    if (input.clientId > 5) return HttpResponse.json({ errors: ['Client not found.'] }, { status: 400 })
    const project = makeProject({ ...input, id: Math.max(0, ...db.projects.map((p) => p.id)) + 1 })
    db.projects.push(project)
    return HttpResponse.json(project, { status: 201 })
  }),

  http.put(url('/projects/:id'), async ({ params, request }) => {
    const index = db.projects.findIndex((p) => p.id === Number(params.id))
    if (index === -1) return notFound()
    const input = (await request.json()) as ProjectInput
    db.projects[index] = { ...db.projects[index], ...input }
    return HttpResponse.json(db.projects[index])
  }),

  http.delete(url('/projects/:id'), ({ params }) => {
    const before = db.projects.length
    db.projects = db.projects.filter((p) => p.id !== Number(params.id))
    return db.projects.length === before ? notFound() : new HttpResponse(null, { status: 204 })
  }),
]

export const server = setupServer(...handlers)

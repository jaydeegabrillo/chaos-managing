export const PROJECT_STATUSES = ['Planning', 'In Progress', 'On Hold', 'Completed'] as const
export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export const PROJECT_PRIORITIES = ['Low', 'Medium', 'High'] as const
export type ProjectPriority = (typeof PROJECT_PRIORITIES)[number]

/** A project as returned by cm-api. Dates are `YYYY-MM-DD` strings. */
export interface Project {
  id: number
  clientId: number
  projectName: string
  description: string | null
  status: ProjectStatus
  priority: ProjectPriority
  startDate: string | null
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export interface ProjectPage {
  data: Project[]
  page: number
  limit: number
  totalItems: number
  totalPages: number
}

/** Payload accepted by `POST /projects` and `PUT /projects/:id`. */
export type ProjectInput = Pick<
  Project,
  'clientId' | 'projectName' | 'description' | 'status' | 'priority' | 'startDate' | 'dueDate'
>

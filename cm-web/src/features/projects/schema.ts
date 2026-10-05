import { z } from 'zod'
import { PROJECT_PRIORITIES, PROJECT_STATUSES, type Project, type ProjectInput } from './types'

const dateField = z.union([z.literal(''), z.iso.date('Enter a valid date.')])

// Mirrors cm-api/src/validators/projectValidator.ts so users see errors before a round trip.
// Form values stay as strings (what inputs produce); `toProjectInput` converts them for the API.
export const projectFormSchema = z
  .object({
    clientId: z.string().regex(/^[1-9]\d*$/, 'Client is required.'),
    projectName: z.string().trim().min(1, 'Project name is required.').max(255, 'Project name is too long.'),
    description: z.string(),
    status: z.enum(PROJECT_STATUSES, 'Choose a valid status.'),
    priority: z.enum(PROJECT_PRIORITIES, 'Choose a valid priority.'),
    startDate: dateField,
    dueDate: dateField,
  })
  .refine((v) => !v.startDate || !v.dueDate || v.dueDate >= v.startDate, {
    message: 'Due date cannot be earlier than the start date.',
    path: ['dueDate'],
  })

export type ProjectFormValues = z.input<typeof projectFormSchema>

export const emptyProjectForm: ProjectFormValues = {
  clientId: '',
  projectName: '',
  description: '',
  status: 'Planning',
  priority: 'Medium',
  startDate: '',
  dueDate: '',
}

export function toFormValues(project: Project): ProjectFormValues {
  return {
    clientId: String(project.clientId),
    projectName: project.projectName,
    description: project.description ?? '',
    status: project.status,
    priority: project.priority,
    startDate: project.startDate?.slice(0, 10) ?? '',
    dueDate: project.dueDate?.slice(0, 10) ?? '',
  }
}

export function toProjectInput(values: ProjectFormValues): ProjectInput {
  return {
    clientId: Number(values.clientId),
    projectName: values.projectName.trim(),
    description: values.description.trim() || null,
    status: values.status,
    priority: values.priority,
    startDate: values.startDate || null,
    dueDate: values.dueDate || null,
  }
}

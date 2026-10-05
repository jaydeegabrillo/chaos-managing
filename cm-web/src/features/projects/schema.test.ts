import { describe, expect, it } from 'vitest'
import { makeProject } from '@/test/server'
import { emptyProjectForm, projectFormSchema, toFormValues, toProjectInput, type ProjectFormValues } from './schema'

const valid: ProjectFormValues = { ...emptyProjectForm, clientId: '2', projectName: 'Brand refresh' }

function errorsFor(values: ProjectFormValues) {
  const result = projectFormSchema.safeParse(values)
  return result.success ? {} : Object.fromEntries(result.error.issues.map((i) => [i.path.join('.'), i.message]))
}

describe('projectFormSchema', () => {
  it('accepts a minimal valid project', () => {
    expect(projectFormSchema.safeParse(valid).success).toBe(true)
  })

  it('requires a client and a project name', () => {
    expect(errorsFor({ ...valid, clientId: '', projectName: '   ' })).toEqual({
      clientId: 'Client is required.',
      projectName: 'Project name is required.',
    })
  })

  it('rejects unknown status and priority values', () => {
    const errors = errorsFor({ ...valid, status: 'Done' as never, priority: 'Urgent' as never })
    expect(errors.status).toBe('Choose a valid status.')
    expect(errors.priority).toBe('Choose a valid priority.')
  })

  it('rejects a due date earlier than the start date', () => {
    expect(errorsFor({ ...valid, startDate: '2026-10-10', dueDate: '2026-10-01' })).toEqual({
      dueDate: 'Due date cannot be earlier than the start date.',
    })
  })

  it('allows the same start and due date, or either one missing', () => {
    expect(errorsFor({ ...valid, startDate: '2026-10-10', dueDate: '2026-10-10' })).toEqual({})
    expect(errorsFor({ ...valid, startDate: '', dueDate: '2026-10-01' })).toEqual({})
    expect(errorsFor({ ...valid, startDate: '2026-10-01', dueDate: '' })).toEqual({})
  })
})

describe('form conversions', () => {
  it('converts form strings into an API payload', () => {
    expect(toProjectInput({ ...valid, projectName: '  Brand refresh ', description: '  ', startDate: '2026-10-01' })).toEqual({
      clientId: 2,
      projectName: 'Brand refresh',
      description: null,
      status: 'Planning',
      priority: 'Medium',
      startDate: '2026-10-01',
      dueDate: null,
    })
  })

  it('round-trips a project through the form', () => {
    const project = makeProject({ description: null, startDate: null })
    expect(toProjectInput(toFormValues(project))).toEqual({
      clientId: project.clientId,
      projectName: project.projectName,
      description: null,
      status: project.status,
      priority: project.priority,
      startDate: null,
      dueDate: project.dueDate,
    })
  })
})

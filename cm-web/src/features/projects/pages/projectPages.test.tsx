import { screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { API_URL } from '@/api/http'
import { renderRoute } from '@/test/render'
import { db, makeProject, server } from '@/test/server'

const seed = () =>
  db.reset([
    makeProject({ id: 1, projectName: 'Website Redesign', clientId: 1, status: 'In Progress', priority: 'High', dueDate: '2026-11-30' }),
    makeProject({ id: 2, projectName: 'Menu App', clientId: 2, status: 'Planning', priority: 'Low', dueDate: '2026-10-15' }),
  ])

const rowNames = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('link')[0].textContent)

describe('projects list', () => {
  it('shows projects with their client names', async () => {
    seed()
    renderRoute('/projects')
    expect(await screen.findByRole('link', { name: 'Website Redesign' })).toBeInTheDocument()
    expect(screen.getByText('Acme Corporation')).toBeInTheDocument()
    expect(screen.getByText('GreenLeaf Cafe')).toBeInTheDocument()
  })

  it('separates status and priority filters from project search', async () => {
    renderRoute('/projects')

    const filterSection = screen.getByRole('region', { name: 'Filters' })
    const listSection = screen.getByRole('region', { name: 'Project list' })
    expect(within(filterSection).getByRole('combobox', { name: 'Filter by status' })).toHaveValue('')
    expect(within(filterSection).getByRole('combobox', { name: 'Filter by priority' })).toHaveValue('')
    expect(within(filterSection).queryByRole('searchbox')).not.toBeInTheDocument()
    expect(within(listSection).getByRole('searchbox', { name: 'Search projects' })).toBeInTheDocument()
  })

  it('shows an empty state when there are no projects', async () => {
    renderRoute('/projects')
    expect(await screen.findByRole('heading', { name: 'No projects yet' })).toBeInTheDocument()
  })

  it('shows the API error and lets the user retry', async () => {
    server.use(http.get(`${API_URL}/projects`, () => HttpResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 })))
    renderRoute('/projects')
    expect(await screen.findByText('Projects couldn’t be loaded.')).toBeInTheDocument()
    expect(screen.getByText('An unexpected error occurred.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })

  it('filters by status and sorts by column', async () => {
    seed()
    const { user, router } = renderRoute('/projects')
    await screen.findByRole('link', { name: 'Website Redesign' })
    expect(rowNames()).toEqual(['Menu App', 'Website Redesign'])

    await user.click(screen.getByRole('button', { name: 'Project' }))
    await user.click(screen.getByRole('button', { name: 'Project' }))
    expect(rowNames()).toEqual(['Website Redesign', 'Menu App'])
    expect(router.state.location.search).toBe('?sort=projectName&dir=desc')

    await user.selectOptions(screen.getByRole('combobox', { name: 'Filter by status' }), 'Planning')
    expect(rowNames()).toEqual(['Menu App'])
  })

  it('searches by client name', async () => {
    seed()
    const { user } = renderRoute('/projects')
    await screen.findByRole('link', { name: 'Website Redesign' })
    await user.type(screen.getByRole('searchbox', { name: 'Search projects' }), 'acme')
    await waitFor(() => expect(rowNames()).toEqual(['Website Redesign']))
  })

  it('opens the edit form in a right-side dialog from the edit action', async () => {
    seed()
    const { user } = renderRoute('/projects')
    await user.click(await screen.findByRole('button', { name: 'Edit Menu App' }))

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(await screen.findByLabelText(/Project name/)).toHaveValue('Menu App')
  })

  it('opens the create form in a right-side dialog from the new project action', async () => {
    const { user } = renderRoute('/projects')
    await user.click(await screen.findByRole('button', { name: 'New project' }))

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'New project' })).toBeInTheDocument()
    expect(screen.getByLabelText(/Project name/)).toHaveValue('')
  })

  it('closes the drawer from its left-edge arrow button', async () => {
    const { user } = renderRoute('/projects')
    await user.click(await screen.findByRole('button', { name: 'New project' }))
    await user.click(await screen.findByRole('button', { name: 'Close project form' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('creates a project from the drawer without leaving the project list', async () => {
    const { user, router } = renderRoute('/projects')
    await user.click(await screen.findByRole('button', { name: 'New project' }))
    await user.type(await screen.findByLabelText(/Project name/), 'Drawer Project')
    await user.selectOptions(screen.getByLabelText(/Client/), 'Nova Fitness')
    await user.selectOptions(screen.getByLabelText(/Priority/), 'High')
    await user.click(screen.getByRole('button', { name: 'Create project' }))

    expect(await screen.findByText('Created “Drawer Project”')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/projects')
    expect(db.projects).toMatchObject([{ projectName: 'Drawer Project', clientId: 4, priority: 'High', status: 'Planning' }])
  })

  it('deletes a project after confirmation', async () => {
    seed()
    const { user } = renderRoute('/projects')
    await user.click(await screen.findByRole('button', { name: 'Delete Menu App' }))
    const dialog = await screen.findByRole('alertdialog')
    await user.click(within(dialog).getByRole('button', { name: 'Delete project' }))

    await waitFor(() => expect(screen.queryByRole('link', { name: 'Menu App' })).not.toBeInTheDocument())
    expect(await screen.findByText('Deleted “Menu App”')).toBeInTheDocument()
    expect(db.projects.map((p) => p.id)).toEqual([1])
  })
})

describe('create project', () => {
  it('validates required fields and the date range before submitting', async () => {
    const { user } = renderRoute('/projects/new')
    await user.click(await screen.findByRole('button', { name: 'Create project' }))

    expect(await screen.findByText('Project name is required.')).toBeInTheDocument()
    expect(screen.getByText('Client is required.')).toBeInTheDocument()
    expect(screen.getByLabelText(/Project name/)).toHaveAttribute('aria-invalid', 'true')

    await user.type(screen.getByLabelText(/Start date/), '2026-10-10')
    await user.type(screen.getByLabelText(/Due date/), '2026-10-01')
    await user.click(screen.getByRole('button', { name: 'Create project' }))
    expect(await screen.findByText('Due date cannot be earlier than the start date.')).toBeInTheDocument()
    expect(db.projects).toHaveLength(0)
  })

  it('creates a project and returns to the list', async () => {
    const { user, router } = renderRoute('/projects/new')
    await user.type(await screen.findByLabelText(/Project name/), 'Loyalty Program')
    await user.selectOptions(screen.getByLabelText(/Client/), 'Nova Fitness')
    await user.selectOptions(screen.getByLabelText(/Priority/), 'High')
    await user.click(screen.getByRole('button', { name: 'Create project' }))

    expect(await screen.findByText('Created “Loyalty Program”')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/projects')
    expect(db.projects).toMatchObject([{ projectName: 'Loyalty Program', clientId: 4, priority: 'High', status: 'Planning' }])
  })

  it('shows API validation errors', async () => {
    server.use(
      http.post(`${API_URL}/projects`, () =>
        HttpResponse.json({ errors: ['Client not found.'] }, { status: 400 }),
      ),
    )
    const { user, router } = renderRoute('/projects/new')
    await user.type(await screen.findByLabelText(/Project name/), 'Loyalty Program')
    await user.selectOptions(screen.getByLabelText(/Client/), 'Nova Fitness')
    await user.click(screen.getByRole('button', { name: 'Create project' }))

    expect(await screen.findByText('The project wasn’t saved.')).toBeInTheDocument()
    expect(screen.getByText('Client not found.')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/projects/new')
  })
})

describe('edit project', () => {
  it('prefills the form and saves changes', async () => {
    seed()
    const { user, router } = renderRoute('/projects/2/edit')
    const name = await screen.findByLabelText(/Project name/)
    expect(name).toHaveValue('Menu App')
    expect(screen.getByLabelText(/Client/)).toHaveDisplayValue('GreenLeaf Cafe')
    expect(screen.getByLabelText(/Status/)).toHaveValue('Planning')

    await user.selectOptions(screen.getByLabelText(/Status/), 'Completed')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(await screen.findByText('Saved changes to “Menu App”')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/projects')
    expect(db.projects.find((p) => p.id === 2)?.status).toBe('Completed')
  })

  it('shows not found for a missing project', async () => {
    renderRoute('/projects/99/edit')
    expect(await screen.findByRole('heading', { name: 'Project not found' })).toBeInTheDocument()
  })

  it('shows not found for an invalid id', async () => {
    renderRoute('/projects/abc/edit')
    expect(await screen.findByRole('heading', { name: 'Project not found' })).toBeInTheDocument()
  })
})

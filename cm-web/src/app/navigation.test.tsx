import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderRoute } from '@/test/render'

describe('sidebar navigation', () => {
  it('links to projects and clients and marks the current page', () => {
    renderRoute('/clients')

    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects')
    expect(screen.getByRole('link', { name: 'Clients' })).toHaveAttribute('aria-current', 'page')
  })

  it('lists clients with their status, active projects and revenue', async () => {
    renderRoute('/clients')

    expect(screen.getByRole('heading', { name: 'Clients' })).toBeInTheDocument()
    expect(await screen.findByText('Acme Corporation')).toBeInTheDocument()
    expect(screen.getByText('5 clients')).toBeInTheDocument()
    expect(screen.getByText(/showing seeded data/i)).toBeInTheDocument()

    const brightRealty = screen.getByRole('row', { name: /Bright Realty/ })
    expect(within(brightRealty).getByText('NEW')).toBeInTheDocument()
    expect(within(brightRealty).getByText('#C003')).toBeInTheDocument()
    expect(within(brightRealty).getByText('Active')).toBeInTheDocument()
    expect(within(brightRealty).getByText('$10.7K')).toBeInTheDocument()
    expect(screen.queryByRole('columnheader', { name: 'Actions' })).not.toBeInTheDocument()
  })

  it('searches clients by name', async () => {
    const { user } = renderRoute('/clients')
    await screen.findByText('Acme Corporation')

    await user.type(screen.getByRole('searchbox', { name: 'Search clients' }), 'acme')
    expect(screen.getByText('Acme Corporation')).toBeInTheDocument()
    expect(screen.queryByText('GreenLeaf Cafe')).not.toBeInTheDocument()
  })

  it('shows a helpful state when the client search has no matches', async () => {
    const { user } = renderRoute('/clients')
    await screen.findByText('Acme Corporation')
    await user.type(screen.getByRole('searchbox', { name: 'Search clients' }), 'unknown')

    expect(screen.getByRole('heading', { name: 'No clients found' })).toBeInTheDocument()
  })
})

import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderRoute } from '@/test/render'

describe('sidebar navigation', () => {
  it('links to projects and clients and marks the current page', () => {
    renderRoute('/clients')

    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects')
    expect(screen.getByRole('link', { name: 'Clients' })).toHaveAttribute('aria-current', 'page')
  })

  it('shows the seeded clients directory', () => {
    renderRoute('/clients')

    expect(screen.getByRole('heading', { name: 'Clients' })).toBeInTheDocument()
    expect(screen.getByText('Acme Corporation')).toBeInTheDocument()
    expect(screen.getByText('Nova Fitness')).toBeInTheDocument()
    expect(screen.getByText(/seeded client list/i)).toBeInTheDocument()
  })
})

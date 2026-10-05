import { describe, expect, it } from 'vitest'
import { makeProject } from '@/test/server'
import { DEFAULT_FILTERS, filterAndSortProjects, readFilters, writeFilters } from './filtering'

const projects = [
  makeProject({ id: 1, projectName: 'Website Redesign', clientId: 1, status: 'In Progress', priority: 'High', dueDate: '2026-11-30' }),
  makeProject({ id: 2, projectName: 'Menu App', clientId: 2, status: 'Planning', priority: 'Low', dueDate: '2026-10-15' }),
  makeProject({ id: 3, projectName: 'Listings Portal', clientId: 3, status: 'On Hold', priority: 'Medium', dueDate: null, description: 'MLS sync' }),
]

const names = (list: { projectName: string }[]) => list.map((p) => p.projectName)

describe('filterAndSortProjects', () => {
  it('sorts by due date ascending by default, with missing dates last', () => {
    expect(names(filterAndSortProjects(projects, DEFAULT_FILTERS))).toEqual(['Menu App', 'Website Redesign', 'Listings Portal'])
  })

  it('keeps missing dates last when sorting descending', () => {
    expect(names(filterAndSortProjects(projects, { ...DEFAULT_FILTERS, dir: 'desc' }))).toEqual([
      'Website Redesign',
      'Menu App',
      'Listings Portal',
    ])
  })

  it('sorts priority by rank rather than alphabetically', () => {
    expect(names(filterAndSortProjects(projects, { ...DEFAULT_FILTERS, sort: 'priority', dir: 'desc' }))).toEqual([
      'Website Redesign',
      'Listings Portal',
      'Menu App',
    ])
  })

  it('searches project name, client name and description', () => {
    expect(names(filterAndSortProjects(projects, { ...DEFAULT_FILTERS, q: 'greenleaf' }))).toEqual(['Menu App'])
    expect(names(filterAndSortProjects(projects, { ...DEFAULT_FILTERS, q: 'mls' }))).toEqual(['Listings Portal'])
  })

  it('filters by status and priority', () => {
    expect(names(filterAndSortProjects(projects, { ...DEFAULT_FILTERS, status: 'Planning' }))).toEqual(['Menu App'])
    expect(names(filterAndSortProjects(projects, { ...DEFAULT_FILTERS, priority: 'High' }))).toEqual(['Website Redesign'])
  })

  it('does not mutate the input array', () => {
    const copy = [...projects]
    filterAndSortProjects(projects, { ...DEFAULT_FILTERS, sort: 'projectName' })
    expect(projects).toEqual(copy)
  })
})

describe('URL filters', () => {
  it('ignores invalid values', () => {
    expect(readFilters(new URLSearchParams('status=Nope&priority=High&sort=hack&dir=sideways'))).toEqual({
      ...DEFAULT_FILTERS,
      priority: 'High',
    })
  })

  it('omits defaults when writing', () => {
    expect(writeFilters({ ...DEFAULT_FILTERS, status: 'On Hold' }).toString()).toBe('status=On+Hold')
  })
})

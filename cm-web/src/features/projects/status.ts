import type { ProjectStatus } from './types'

/** Tailwind background class for each status (dot and schedule rail). */
export const statusColor: Record<ProjectStatus, string> = {
  Planning: 'bg-status-planning',
  'In Progress': 'bg-status-progress',
  'On Hold': 'bg-status-hold',
  Completed: 'bg-status-done',
}

import { Navigate, type RouteObject } from 'react-router'
import ProjectsListPage from '@/features/projects/pages/ProjectsListPage'
import ClientsListPage from '@/features/projects/pages/ClientsListPage'
import { Layout } from './Layout'
import { NotFound } from './NotFound'
import { RouteError } from './RouteError'

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      {
        errorElement: <RouteError />,
        children: [
          { index: true, element: <Navigate to="/projects" replace /> },
          { path: 'projects', element: <ProjectsListPage /> },
          { path: 'clients', element: <ClientsListPage /> },
          // Form pages pull in react-hook-form + zod; load them only when needed.
          {
            path: 'projects/new',
            lazy: () => import('@/features/projects/pages/ProjectCreatePage').then((m) => ({ Component: m.default })),
          },
          {
            path: 'projects/:id/edit',
            lazy: () => import('@/features/projects/pages/ProjectEditPage').then((m) => ({ Component: m.default })),
          },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
]

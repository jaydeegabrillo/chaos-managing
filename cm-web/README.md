# cm-web

React frontend for the Chaos Managing project tracker. It lists, creates, edits, and deletes projects through the `cm-api` REST API.

## Prerequisites

- Node.js 22 or later
- pnpm 11.25.0 (the version pinned in `package.json`)
- The `cm-api` service and its PostgreSQL database running locally or reachable over the network

If pnpm is not available, enable it through Corepack, which ships with Node.js:

```sh
corepack enable
corepack prepare pnpm@11.25.0 --activate
```

Set up and start the API first. Follow the [`cm-api` setup guide](../cm-api/README.md); the frontend expects the API at `http://localhost:3000` by default.

## Setup

Run the following commands from the `cm-web/` directory.

### 1. Install dependencies

```sh
pnpm install
```

### 2. Configure the API URL

Create a local environment file from the example:

```sh
cp .env.example .env
```

| Variable       | Default                   | Description                                  |
| -------------- | ------------------------- | -------------------------------------------- |
| `VITE_API_URL` | `http://localhost:3000`   | Base URL for the `cm-api` service, no trailing slash |

Change `VITE_API_URL` in `.env` if the API runs at a different host or port. Restart the Vite dev server after changing environment variables.

### 3. Start the development server

```sh
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173). Keep the API running in a separate terminal.

## Scripts

| Command          | Description                              |
| ---------------- | ---------------------------------------- |
| `pnpm dev`       | Start the Vite development server        |
| `pnpm build`     | Type-check and build the app into `dist/`|
| `pnpm preview`   | Serve the production build locally       |
| `pnpm typecheck` | Run the TypeScript project checks        |
| `pnpm lint`      | Run Oxlint                              |
| `pnpm test`      | Run the Vitest test suite once           |
| `pnpm test:watch`| Run Vitest in watch mode                 |

## Stack

- Vite, React 19, and TypeScript
- React Router for routing and lazy-loaded create/edit pages
- TanStack Query for server state, caching, and mutation invalidation
- React Hook Form and Zod for form handling and validation
- Tailwind CSS 4, Radix UI primitives, and Sonner toasts
- Vitest, Testing Library, and MSW for tests

## Features

- Project list with client, status, priority, and schedule information
- Responsive sidebar navigation for Projects and Clients
- Client directory showing the seeded client reference list
- Client-side search, filters, and sorting, with view state stored in the URL
- Create and edit projects in an animated right-side drawer with inline validation and API error messages
- Delete confirmation from the list and edit page
- Loading, empty, error-with-retry, and not-found states

## Project structure

```
src/
  api/                 fetch wrapper and project endpoints
  app/                 router, layout, sidebar, providers, error and 404 views
  components/ui/       shared UI primitives
  features/projects/   project types, schema, queries, components, and pages
  lib/                 date and class-name helpers
  test/                MSW mock API and render helper
```

## Known limitation: clients

`cm-api` does not currently provide client endpoints, so the client dropdown uses a static list matching the API seeder (`src/features/projects/clients.ts`). If the database was seeded differently, client names may not match. The API rejects unknown client IDs with `Client not found.` Once a `GET /clients` endpoint is available, the static list can be replaced with an API query.

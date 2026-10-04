# cm-api

REST API for Chaos Managing, built with Express 5, TypeScript, Sequelize and PostgreSQL.

## Prerequisites

- Node.js 24 or later
- PostgreSQL, running locally or reachable over the network
- pnpm (the project's package manager, see `packageManager` in `package.json`). npm also works; replace `pnpm` with `npm run` in the commands below.

To enable pnpm through Corepack, which ships with Node.js:

```sh
corepack enable
```

## Setup

All commands are run from the `cm-api/` directory.

### 1. Install dependencies

```sh
pnpm install
```

### 2. Configure the environment

Copy the example file and fill in your PostgreSQL credentials:

```sh
cp .env.example .env
```

| Variable      | Default          | Description                          |
| ------------- | ---------------- | ------------------------------------ |
| `PORT`        | `3000`           | Port the API listens on              |
| `DB_HOST`     | `127.0.0.1`      | PostgreSQL host                      |
| `DB_PORT`     | `5432`           | PostgreSQL port                      |
| `DB_NAME`     | (required)       | Database name, e.g. `chaos_managing` |
| `DB_USER`     | (required)       | Database user                        |
| `DB_PASSWORD` | (required)       | Database password                    |

The API and the Sequelize CLI both read this file.

### 3. Create the database

Skip this step if the database already exists.

```sh
npx sequelize-cli db:create
```

### 4. Run the migrations

```sh
pnpm db:migrate
```

This creates the tables in order:

1. `clients`: id, name, contact_person, email (unique), phone, address, created_at, updated_at
2. `projects`: id, client_id (references `clients.id`), project_name, description, status, priority, start_date, due_date, created_at, updated_at

To see which migrations have been applied:

```sh
npx sequelize-cli db:migrate:status
```

### 5. Seed sample data (optional)

```sh
pnpm db:seed
```

This runs the seeders in `database/seeders` in filename order:

1. `seed-clients`: 5 clients with sample contact details
2. `seed-projects`: 6 projects linked to those clients by name (Acme Corporation has 2, every other client has 1)

Applied seeders are recorded in the `SequelizeData` table, so running the command again does not insert duplicates.

### 6. Start the API

```sh
pnpm dev
```

The API runs at `http://localhost:3000` (or the `PORT` you set) and reloads on file changes.

For a production build:

```sh
pnpm build
pnpm start
```

## Database commands

| Command                                 | Description                                       |
| --------------------------------------- | ------------------------------------------------- |
| `pnpm db:migrate`                       | Apply all pending migrations                      |
| `pnpm db:migrate:undo`                  | Revert the most recent migration                  |
| `npx sequelize-cli db:migrate:undo:all` | Revert every migration (drops all tables)         |
| `pnpm db:seed`                          | Run all seeders that have not been applied yet    |
| `pnpm db:seed:undo`                     | Revert all seeders (removes the seeded rows)      |

To reset the database to a freshly seeded state:

```sh
npx sequelize-cli db:migrate:undo:all
pnpm db:migrate
pnpm db:seed
```

`db:migrate:undo:all` drops the tables and everything in them, including data you added yourself.

### Adding a migration or seeder

```sh
npx sequelize-cli migration:generate --name create-something
npx sequelize-cli seed:generate --name seed-something
```

Files are created in `database/migrations` and `database/seeders`. Migrations run in filename order, so a table must be created after any table it references.

## API

| Method | Path            | Description          |
| ------ | --------------- | -------------------- |
| GET    | `/projects`     | List all projects    |
| GET    | `/projects/:id` | Get a single project |
| POST   | `/projects`     | Create a project     |
| PUT    | `/projects/:id` | Replace a project    |
| DELETE | `/projects/:id` | Delete a project     |

Example request body for `POST` and `PUT`:

```json
{
    "clientId": 1,
    "projectName": "Corporate Website Redesign",
    "description": "Redesign and modernize the company's corporate website.",
    "status": "In Progress",
    "priority": "High",
    "startDate": "2026-06-01",
    "dueDate": "2026-07-15"
}
```

- `status` is one of `Planning`, `In Progress`, `On Hold`, `Completed`.
- `priority` is one of `Low`, `Medium`, `High`.
- `description`, `startDate` and `dueDate` are optional; `dueDate` cannot be earlier than `startDate`.
- A `clientId` that does not exist returns `400`.

## Project structure

```
cm-api/
├── database/
│   ├── config.js        Sequelize CLI connection settings
│   ├── migrations/      Schema changes, applied in filename order
│   └── seeders/         Sample data
└── src/
    ├── associates.ts    Model associations, loaded once by app.ts
    ├── app.ts           Express app and route registration
    ├── server.ts        Entry point
    ├── config/          Runtime database connection
    ├── controllers/     Request handlers
    ├── interfaces/      Shared TypeScript types
    ├── models/          Sequelize models
    ├── routes/          Express routers
    ├── services/        Data access functions
    └── validators/      Joi request validation
```

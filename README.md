# Full Stack Developer Technical Assessment

Thank you for your interest in joining our team.

This assessment is designed to evaluate your problem-solving skills, coding practices, technical decision-making, and ability to deliver a functional application.

## Estimated Time

2-4 hours

## Objective

Build a simple Task Management application that allows users to create, update, view, and delete tasks.

The assessment focuses on code quality, architecture, maintainability, and communication rather than feature completeness.

## Instructions

Please review the following documents before starting:

* REQUIREMENTS.md
* SUBMISSION.md

## Allowed Tools

You may use:

* AI tools (ChatGPT, Claude, Cursor, GitHub Copilot, etc.)
* Open-source libraries
* Frameworks of your choice

If AI tools are used, please disclose them in your submission.

## Evaluation Criteria

Your submission will be evaluated based on:

* Functionality
* Code Quality
* Architecture
* Documentation
* Error Handling
* Communication of Technical Decisions

Good luck, and we look forward to reviewing your submission.

## Docker setup

From the repository root, start the API, web app, and PostgreSQL database with:

```sh
docker compose up --build
```

The web app is available at <http://localhost:8080> and the API at <http://localhost:3000>. Once PostgreSQL is healthy, the API container runs pending migrations and seeders before starting the server. PostgreSQL data is kept in the `postgres_data` volume across restarts.

API startup also loads the sample data once, so the initial client and project lists are populated. To override the development-only database credentials, copy the root `.env.example` to `.env` and edit it. Change the sample password before exposing the services beyond a local development environment. If the browser needs to reach the API at another address, set `VITE_API_URL` in `.env` before building; it is compiled into the frontend image.

To stop the services while retaining database data, run `docker compose down`. To also remove the database volume and its contents, run `docker compose down --volumes`.

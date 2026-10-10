import type { Request, Response } from "express";
import { ForeignKeyConstraintError } from "sequelize";
import { Project } from "../models/Project";
import type { ProjectIdParams, ProjectRequestBody } from "../interfaces/Project";
import { validateProjectId, validateProjectPayload } from "../validators/projectValidator";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

type PaginationQuery = {
    page?: string | string[];
    limit?: string | string[];
};

function handleUnexpectedError(res: Response, error: unknown) {
    // Only projects.client_id references another table, so this means the client does not exist.
    if (error instanceof ForeignKeyConstraintError) return res.status(400).json({ errors: ["Client not found."] });
    console.error("Project request failed:", error);
    return res.status(500).json({ error: "An unexpected error occurred." });
}

function parsePositiveInt(rawValue: unknown, fallback: number) {
    if (rawValue === undefined || rawValue === null || rawValue === "") return fallback;
    const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1) return null;
    return parsed;
}

async function getAllProjects({ query }: Request<Record<string, never>, unknown, unknown, PaginationQuery>, res: Response) {
    const hasPaginationParams = query.page !== undefined || query.limit !== undefined;

    try {
        if (!hasPaginationParams) {
            const projects = await Project.findAll({ order: [["id", "ASC"]] });
            return res.json(projects);
        }

        const page = parsePositiveInt(query.page, DEFAULT_PAGE);
        const limit = parsePositiveInt(query.limit, DEFAULT_LIMIT);

        if (page === null || limit === null) {
            return res.status(400).json({ error: "Page and limit must be positive integers." });
        }

        const { rows, count } = await Project.findAndCountAll({
            order: [["id", "ASC"]],
            limit,
            offset: (page - 1) * limit,
        });

        return res.json({
            data: rows,
            page,
            limit,
            totalItems: count,
            totalPages: Math.ceil(count / limit) || 1,
        });
    } catch (error) {
        return handleUnexpectedError(res, error);
    }
}

async function getProjectById({ params }: Request<ProjectIdParams>, res: Response) {
    const id = validateProjectId(params.id);
    if (id.error) return res.status(400).json({ error: id.error });
    try {
        const project = await Project.findByPk(id.value);
        if (!project) return res.status(404).json({ error: "Project not found." });
        return res.json(project);
    } catch (error) {
        return handleUnexpectedError(res, error);
    }
}

async function createProject({ body = {} }: Request<Record<string, string>, unknown, ProjectRequestBody>, res: Response) {
    const { errors, value } = validateProjectPayload(body);
    if (!value) return res.status(400).json({ errors });
    try {
        const project = await Project.create(value);
        return res.status(201).json(project);
    } catch (error) {
        return handleUnexpectedError(res, error);
    }
}

async function updateProject({ params, body = {} }: Request<ProjectIdParams, unknown, ProjectRequestBody>, res: Response) {
    const id = validateProjectId(params.id);
    if (id.error) return res.status(400).json({ error: id.error });
    const { errors, value } = validateProjectPayload(body);
    if (!value) return res.status(400).json({ errors });
    try {
        const project = await Project.findByPk(id.value);
        if (!project) return res.status(404).json({ error: "Project not found." });
        await project.update(value);
        return res.json(project);
    } catch (error) {
        return handleUnexpectedError(res, error);
    }
}

async function deleteProject({ params }: Request<ProjectIdParams>, res: Response) {
    const id = validateProjectId(params.id);
    if (id.error) return res.status(400).json({ error: id.error });
    try {
        const deleted = await Project.destroy({ where: { id: id.value } });
        if (!deleted) return res.status(404).json({ error: "Project not found." });
        return res.status(204).end();
    } catch (error) {
        return handleUnexpectedError(res, error);
    }
}

export { createProject, deleteProject, getAllProjects, getProjectById, updateProject };

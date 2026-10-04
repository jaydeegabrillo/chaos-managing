import type { Request, Response } from "express";
import { Project } from "../models/Project";
import type { ProjectIdParams, ProjectRequestBody } from "../interfaces/Project";
import { validateProjectId, validateProjectPayload } from "../validators/projectValidator";

function handleUnexpectedError(res: Response, error: unknown) {
    console.error("Project request failed:", error);
    return res.status(500).json({ error: "An unexpected error occurred." });
}

async function getAllProjects(_req: Request, res: Response) {
    try {
        const projects = await Project.findAll({ order: [["id", "ASC"]] });
        return res.json(projects);
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

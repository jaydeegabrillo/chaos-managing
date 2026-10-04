export const PROJECT_STATUSES = ["Planning", "In Progress", "On Hold", "Completed"] as const;
export const PROJECT_PRIORITIES = ["Low", "Medium", "High"] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export type ProjectPriority = (typeof PROJECT_PRIORITIES)[number];

export interface ProjectPayload {
    clientId: number;
    projectName: string;
    description?: string | null;
    status: ProjectStatus;
    priority: ProjectPriority;
    startDate?: string | null;
    dueDate?: string | null;
}

// Raw request body before validation; the Joi schema in validators/projectValidator decides what is accepted.
export interface ProjectRequestBody {
    clientId?: unknown;
    projectName?: unknown;
    description?: unknown;
    status?: unknown;
    priority?: unknown;
    startDate?: unknown;
    dueDate?: unknown;
}

export interface ProjectIdParams {
    id: string;
}

export interface ProjectRecord extends ProjectPayload {
    id: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProjectValidationResult {
    errors: string[];
    value?: ProjectPayload;
}

export interface ProjectIdValidationResult {
    error?: string;
    value?: number;
}

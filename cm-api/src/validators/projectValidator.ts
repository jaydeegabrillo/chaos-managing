import Joi from "joi";
import {
    PROJECT_PRIORITIES,
    PROJECT_STATUSES,
    type ProjectIdValidationResult,
    type ProjectPayload,
    type ProjectValidationResult,
} from "../interfaces/Project";
const projectPayloadSchema = Joi.object<ProjectPayload>({
    clientId: Joi.number().integer().positive().required().messages({
        "any.required": "Client ID is required.",
        "number.base": "Client ID must be a positive integer.",
        "number.integer": "Client ID must be a positive integer.",
        "number.positive": "Client ID must be a positive integer.",
    }),
    projectName: Joi.string().trim().required().messages({
        "any.required": "Project Name is required.",
        "string.empty": "Project Name is required.",
        "string.base": "Project Name must be a string.",
    }),
    description: Joi.string().allow("", null).default(null).messages({
        "string.base": "Description must be a string.",
    }),
    status: Joi.string().valid(...PROJECT_STATUSES).required().messages({
        "any.required": "Status is required.",
        "any.only": "Status must be Planning, In Progress, On Hold, or Completed.",
        "string.base": "Status must be a string.",
    }),
    priority: Joi.string().valid(...PROJECT_PRIORITIES).required().messages({
        "any.required": "Priority is required.",
        "any.only": "Priority must be Low, Medium, or High.",
        "string.base": "Priority must be a string.",
    }),
    startDate: Joi.string().isoDate().allow(null).default(null).messages({
        "string.isoDate": "Start Date must be a valid ISO date.",
        "string.base": "Start Date must be a string.",
    }),
    dueDate: Joi.string().isoDate().allow(null).default(null).messages({
        "string.isoDate": "Due Date must be a valid ISO date.",
        "string.base": "Due Date must be a string.",
    }),
})
    .custom((payload, helpers) => {
        if (payload.startDate && payload.dueDate && payload.dueDate < payload.startDate) {
            return helpers.error("project.dateOrder");
        }
        return payload;
    })
    .messages({
        "project.dateOrder": "Due Date cannot be earlier than Start Date.",
    });

const projectIdSchema = Joi.number().integer().positive().required().messages({
    "any.required": "Project ID must be a positive integer.",
    "number.base": "Project ID must be a positive integer.",
    "number.integer": "Project ID must be a positive integer.",
    "number.positive": "Project ID must be a positive integer.",
});

/**
 */
function validateProjectId(id: string): ProjectIdValidationResult {
    const { error, value } = projectIdSchema.validate(id);
    return {
        error: error ? error.details[0].message : undefined,
        value: error ? undefined : value,
    };
}

/**
 */
function validateProjectPayload(payload: unknown): ProjectValidationResult {
    const { error, value } = projectPayloadSchema.validate(payload, {
        abortEarly: false,
        convert: true,
        stripUnknown: true,
    });

    return {
        errors: error ? error.details.map((detail) => detail.message) : [],
        value: error ? undefined : value,
    };
}

export { validateProjectId, validateProjectPayload };

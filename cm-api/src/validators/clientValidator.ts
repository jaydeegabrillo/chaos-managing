import Joi from "joi";
import type { ClientIdValidationResult, ClientPayload, ClientValidationResult } from "../interfaces/Client";

const clientPayloadSchema = Joi.object<ClientPayload>({
    name: Joi.string().trim().required().messages({
        "any.required": "Name is required.",
        "string.empty": "Name is required.",
        "string.base": "Name must be a string.",
    }),
    // Blank optional fields are stored as null so they never collide on the unique email index.
    contactPerson: Joi.string().trim().empty("").allow(null).default(null).messages({
        "string.base": "Contact Person must be a string.",
    }),
    email: Joi.string().trim().lowercase().email().empty("").allow(null).default(null).messages({
        "string.email": "Email must be a valid email address.",
        "string.base": "Email must be a string.",
    }),
    phone: Joi.string().trim().max(30).empty("").allow(null).default(null).messages({
        "string.max": "Phone must be at most 30 characters.",
        "string.base": "Phone must be a string.",
    }),
    address: Joi.string().trim().empty("").allow(null).default(null).messages({
        "string.base": "Address must be a string.",
    }),
});

const clientIdSchema = Joi.number().integer().positive().required().messages({
    "any.required": "Client ID must be a positive integer.",
    "number.base": "Client ID must be a positive integer.",
    "number.integer": "Client ID must be a positive integer.",
    "number.positive": "Client ID must be a positive integer.",
});

function validateClientId(id: unknown): ClientIdValidationResult {
    const { error, value } = clientIdSchema.validate(id);
    return {
        error: error ? error.details[0].message : undefined,
        value: error ? undefined : value,
    };
}

function validateClientPayload(payload: unknown): ClientValidationResult {
    const { error, value } = clientPayloadSchema.validate(payload, {
        abortEarly: false,
        convert: true,
        stripUnknown: true,
    });

    return {
        errors: error ? error.details.map((detail) => detail.message) : [],
        value: error ? undefined : value,
    };
}

export { validateClientId, validateClientPayload };

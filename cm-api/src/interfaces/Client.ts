export interface ClientPayload {
    name: string;
    contactPerson?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
}

export interface ClientRecord extends ClientPayload {
    id: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ClientValidationResult {
    errors: string[];
    value?: ClientPayload;
}

export interface ClientIdValidationResult {
    error?: string;
    value?: number;
}

export interface ClientPayload {
    name: string;
    contactPerson?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
}

export const CLIENT_STATUSES = ["Active", "Inactive"] as const;
export type ClientStatus = (typeof CLIENT_STATUSES)[number];

export interface ClientRecord extends ClientPayload {
    id: number;
    status: ClientStatus;
    revenue: number;
    isNew: boolean;
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

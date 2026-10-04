import { Client } from "../models/Client";
import type { ClientPayload } from "../interfaces/Client";

function getAllClients() {
    return Client.findAll({ order: [["id", "ASC"]] });
}

function getClientById(id: number) {
    return Client.findByPk(id);
}

// Rejects with a UniqueConstraintError when the email is already used by another client.
function createClient(payload: ClientPayload) {
    return Client.create(payload);
}

// Resolves to null when the client does not exist; rejects with a UniqueConstraintError on a duplicate email.
async function updateClient(id: number, payload: ClientPayload) {
    const client = await Client.findByPk(id);
    if (!client) return null;
    return client.update(payload);
}

// Resolves to false when the client does not exist; rejects with a
// ForeignKeyConstraintError while the client still has projects.
async function deleteClient(id: number) {
    return (await Client.destroy({ where: { id } })) > 0;
}

export { createClient, deleteClient, getAllClients, getClientById, updateClient };

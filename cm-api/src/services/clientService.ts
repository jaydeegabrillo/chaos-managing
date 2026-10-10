import { literal } from "sequelize";
import { Client } from "../models/Client";
import type { ClientPayload } from "../interfaces/Client";

function getAllClients(page?: number, limit?: number) {
    if (page === undefined && limit === undefined) {
        return Client.findAll({ order: [["id", "ASC"]] });
    }

    const pageNumber = Number.isFinite(page) && Number(page) > 0 ? Number(page) : 1;
    const pageSize = Number.isFinite(limit) && Number(limit) > 0 ? Number(limit) : 10;

    return Client.findAndCountAll({
        order: [["id", "ASC"]],
        limit: pageSize,
        offset: (pageNumber - 1) * pageSize,
    }).then(({ rows, count }) => ({
        rows,
        count,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(count / pageSize) || 1,
    }));
}

// Every client with the number of its projects that are not yet Completed.
function getClientsWithActiveProjects() {
    return Client.findAll({
        attributes: {
            include: [
                [
                    literal(
                        `(SELECT COUNT(*)::int FROM projects WHERE projects.client_id = "Client"."id" AND projects.status <> 'Completed')`
                    ),
                    "activeProjects",
                ],
            ],
        },
        order: [["id", "ASC"]],
    });
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

export { createClient, deleteClient, getAllClients, getClientById, getClientsWithActiveProjects, updateClient };

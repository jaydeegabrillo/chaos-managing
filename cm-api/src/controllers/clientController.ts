import type { Request, Response } from "express";
import { getClientsWithActiveProjects } from "../services/clientService";

async function getAllClients(_req: Request, res: Response) {
    try {
        return res.json(await getClientsWithActiveProjects());
    } catch (error) {
        console.error("Client request failed:", error);
        return res.status(500).json({ error: "An unexpected error occurred." });
    }
}

export { getAllClients };

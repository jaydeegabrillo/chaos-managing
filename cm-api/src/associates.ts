import { Client } from "./models/Client";
import { Project } from "./models/Project";

// Imported once by app.ts so every association exists before any request runs.
Client.hasMany(Project, { foreignKey: "clientId", as: "projects" });
Project.belongsTo(Client, { foreignKey: "clientId", as: "client" });

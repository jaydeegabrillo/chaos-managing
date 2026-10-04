import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import type { ProjectPayload, ProjectRecord } from "../interfaces/Project";

const Project = sequelize.define<Model<ProjectRecord, ProjectPayload>>(
    "Project",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        clientName: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: "client_name",
        },
        projectName: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: "project_name",
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        priority: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            field: "start_date",
        },
        dueDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            field: "due_date",
        },
    },
    {
        tableName: "projects",
        timestamps: false,
    }
);

export { Project };

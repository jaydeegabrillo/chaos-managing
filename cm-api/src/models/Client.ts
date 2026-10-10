import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import type { ClientPayload, ClientRecord } from "../interfaces/Client";

const Client = sequelize.define<Model<ClientRecord, ClientPayload>>(
    "Client",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        contactPerson: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: "contact_person",
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: true,
            unique: true,
        },
        phone: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: "Active",
        },
        // NUMERIC comes back from pg as a string; the getter exposes it as a number.
        revenue: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
            get() {
                return Number(this.getDataValue("revenue"));
            },
        },
        isNew: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: "is_new",
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "created_at",
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "updated_at",
        },
    },
    {
        tableName: "clients",
        timestamps: true,
        underscored: true,
    }
);

export { Client };

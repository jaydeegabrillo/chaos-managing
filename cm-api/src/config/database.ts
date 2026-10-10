import { Sequelize } from "sequelize";
import "dotenv/config";

function requiredEnvironmentVariable(
    name: "DB_NAME" | "DB_USER" | "DB_PASSWORD",
    fallback?: string
): string {
    const value = process.env[name] ?? fallback;

    if (!value) {
        throw new Error(`${name} must be defined.`);
    }

    return value;
}

const sequelize = new Sequelize(
    requiredEnvironmentVariable("DB_NAME", "chaos_managing"),
    requiredEnvironmentVariable("DB_USER", "postgres"),
    requiredEnvironmentVariable("DB_PASSWORD", "postgres"),
    {
        host: process.env.DB_HOST || "127.0.0.1",
        port: Number(process.env.DB_PORT || 5432),
        dialect: "postgres",
        logging: false,
    }
);

export default sequelize;

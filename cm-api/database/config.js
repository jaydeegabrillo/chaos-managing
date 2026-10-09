"use strict";

const path = require("node:path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const databaseConfiguration = {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "chaos_managing",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 5432),
    dialect: "postgres",
    // Record applied seeders in the SequelizeData table so db:seed:all never inserts twice.
    seederStorage: "sequelize",
};

module.exports = {
    development: databaseConfiguration,
    production: databaseConfiguration,
};

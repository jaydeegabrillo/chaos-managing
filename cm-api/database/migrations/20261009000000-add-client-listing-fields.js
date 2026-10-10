"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("clients", "status", {
            type: Sequelize.TEXT,
            allowNull: false,
            defaultValue: "Active",
        });
        await queryInterface.addColumn("clients", "revenue", {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
        });
        await queryInterface.addColumn("clients", "is_new", {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        });

        await queryInterface.sequelize.query(`
            ALTER TABLE clients
                ADD CONSTRAINT clients_status_valid CHECK (status IN ('Active', 'Inactive')),
                ADD CONSTRAINT clients_revenue_not_negative CHECK (revenue >= 0)
        `);
    },

    async down(queryInterface) {
        await queryInterface.sequelize.query(`
            ALTER TABLE clients
                DROP CONSTRAINT clients_status_valid,
                DROP CONSTRAINT clients_revenue_not_negative
        `);
        await queryInterface.removeColumn("clients", "is_new");
        await queryInterface.removeColumn("clients", "revenue");
        await queryInterface.removeColumn("clients", "status");
    },
};

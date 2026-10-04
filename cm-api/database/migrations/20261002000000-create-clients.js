"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("clients", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            contact_person: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            email: {
                type: Sequelize.TEXT,
                allowNull: true,
                unique: true,
            },
            phone: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            address: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("NOW"),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("NOW"),
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("clients");
    },
};

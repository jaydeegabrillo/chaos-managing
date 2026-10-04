"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("projects", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            client_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "clients",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            },
            project_name: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            status: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            priority: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            start_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            due_date: {
                type: Sequelize.DATEONLY,
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

        await queryInterface.addIndex("projects", ["client_id"]);

        await queryInterface.sequelize.query(`
            ALTER TABLE projects
                ADD CONSTRAINT projects_status_valid
                    CHECK (status IN ('Planning', 'In Progress', 'On Hold', 'Completed')),
                ADD CONSTRAINT projects_priority_valid
                    CHECK (priority IN ('Low', 'Medium', 'High')),
                ADD CONSTRAINT projects_due_date_not_before_start_date
                    CHECK (due_date IS NULL OR start_date IS NULL OR due_date >= start_date)
        `);
    },

    async down(queryInterface) {
        await queryInterface.dropTable("projects");
    },
};

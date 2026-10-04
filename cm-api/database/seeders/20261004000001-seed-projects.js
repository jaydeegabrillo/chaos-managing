"use strict";

// clientName is resolved to client_id from the clients seeded by 20261004000000-seed-clients.
const projects = [
    {
        clientName: "Acme Corporation",
        project_name: "Corporate Website Redesign",
        description: "Redesign and modernize the company's corporate website.",
        status: "In Progress",
        priority: "High",
        start_date: "2026-06-01",
        due_date: "2026-07-15",
    },
    {
        clientName: "Acme Corporation",
        project_name: "Internal HR Portal",
        description: "Build a self-service portal for leave requests and payslips.",
        status: "Planning",
        priority: "Medium",
        start_date: "2026-08-01",
        due_date: "2026-10-31",
    },
    {
        clientName: "GreenLeaf Cafe",
        project_name: "Online Ordering System",
        description: "Develop an online ordering platform for customers.",
        status: "Planning",
        priority: "Medium",
        start_date: "2026-06-10",
        due_date: "2026-08-01",
    },
    {
        clientName: "Bright Realty",
        project_name: "Property Listing Portal",
        description: "Build a portal for managing property listings.",
        status: "On Hold",
        priority: "Medium",
        start_date: "2026-05-15",
        due_date: "2026-07-30",
    },
    {
        clientName: "Nova Fitness",
        project_name: "Mobile App MVP",
        description: "Develop the first version of the fitness tracking app.",
        status: "In Progress",
        priority: "High",
        start_date: "2026-06-05",
        due_date: "2026-08-20",
    },
    {
        clientName: "HealthFirst Clinic",
        project_name: "Patient Appointment System",
        description: "Build an appointment scheduling application.",
        status: "Completed",
        priority: "High",
        start_date: "2026-03-01",
        due_date: "2026-05-01",
    },
];

module.exports = {
    async up(queryInterface, Sequelize) {
        const clients = await queryInterface.sequelize.query("SELECT id, name FROM clients WHERE name IN (:names)", {
            replacements: { names: [...new Set(projects.map((project) => project.clientName))] },
            type: Sequelize.QueryTypes.SELECT,
        });
        const clientIds = new Map(clients.map((client) => [client.name, client.id]));

        await queryInterface.bulkInsert(
            "projects",
            projects.map(({ clientName, ...project }) => {
                const clientId = clientIds.get(clientName);
                if (!clientId) throw new Error(`Client "${clientName}" not found. Run the clients seeder first.`);
                return { ...project, client_id: clientId };
            })
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("projects", {
            project_name: { [Sequelize.Op.in]: projects.map((project) => project.project_name) },
        });
    },
};

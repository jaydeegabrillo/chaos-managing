"use strict";

const clients = [
    {
        name: "Acme Corporation",
        contact_person: "Maria Santos",
        email: "maria.santos@acme.example.com",
        phone: "+1 555 0101",
        address: "100 Market Street, San Francisco, CA",
    },
    {
        name: "GreenLeaf Cafe",
        contact_person: "Daniel Reyes",
        email: "daniel@greenleaf.example.com",
        phone: "+1 555 0102",
        address: "22 Oak Avenue, Portland, OR",
    },
    {
        name: "Bright Realty",
        contact_person: "Aisha Khan",
        email: "aisha.khan@brightrealty.example.com",
        phone: "+1 555 0103",
        address: "8 Harbor Road, Seattle, WA",
    },
    {
        name: "Nova Fitness",
        contact_person: "Liam Chen",
        email: "liam@novafitness.example.com",
        phone: "+1 555 0104",
        address: "415 Elm Street, Austin, TX",
    },
    {
        name: "HealthFirst Clinic",
        contact_person: "Grace Okafor",
        email: "grace.okafor@healthfirst.example.com",
        phone: "+1 555 0105",
        address: "60 Pine Boulevard, Denver, CO",
    },
];

module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("clients", clients);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("clients", {
            email: { [Sequelize.Op.in]: clients.map((client) => client.email) },
        });
    },
};

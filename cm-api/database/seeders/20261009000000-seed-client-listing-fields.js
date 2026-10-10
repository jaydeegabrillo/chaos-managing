"use strict";

// Fills the status/revenue/is_new columns added by 20261009000000-add-client-listing-fields
// for the clients seeded by 20261004000000-seed-clients.
const listingFields = [
    { email: "maria.santos@acme.example.com", status: "Active", revenue: 15200, is_new: false },
    { email: "daniel@greenleaf.example.com", status: "Active", revenue: 9300, is_new: false },
    { email: "aisha.khan@brightrealty.example.com", status: "Active", revenue: 10700, is_new: true },
    { email: "liam@novafitness.example.com", status: "Active", revenue: 3800, is_new: false },
    { email: "grace.okafor@healthfirst.example.com", status: "Active", revenue: 5600, is_new: false },
];

module.exports = {
    async up(queryInterface) {
        for (const { email, ...fields } of listingFields) {
            await queryInterface.bulkUpdate("clients", fields, { email });
        }
    },

    async down(queryInterface) {
        for (const { email } of listingFields) {
            await queryInterface.bulkUpdate("clients", { status: "Active", revenue: 0, is_new: false }, { email });
        }
    },
};

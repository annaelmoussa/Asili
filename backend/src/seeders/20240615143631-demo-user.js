"use strict";

const bcrypt = require("bcrypt");
const { ALL_SCOPES } = require("../config/loadScopes");

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("password", 10);
    return queryInterface.bulkInsert("User", [
      {
        id: Sequelize.literal("uuid_generate_v4()"),
        email: "user@example.com",
        password: hashedPassword,
        role: "ROLE_USER",
        isConfirmed: true,
        scopes: ["read:widgets"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal("uuid_generate_v4()"),
        email: "admin@example.com",
        password: hashedPassword,
        role: "ROLE_ADMIN",
        isConfirmed: true,
        scopes: ALL_SCOPES,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("User", null, {});
  },
};

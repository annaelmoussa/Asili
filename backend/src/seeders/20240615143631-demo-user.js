"use strict";
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { ALL_SCOPES } = require("../config/loadScopes");

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("password", 10);

    const users = [
      {
        id: uuidv4(),
        email: "user@example.com",
        password: hashedPassword,
        role: "ROLE_USER",
        isConfirmed: true,
        scopes: ["read:widgets"],
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        email: "admin@example.com",
        password: hashedPassword,
        role: "ROLE_ADMIN",
        isConfirmed: true,
        scopes: ALL_SCOPES,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const user of users) {
      const existingUser = await queryInterface.rawSelect(
        "User",
        {
          where: {
            email: user.email,
          },
        },
        ["id"]
      );

      if (!existingUser) {
        await queryInterface.bulkInsert("User", [user]);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("User", null, {});
  },
};

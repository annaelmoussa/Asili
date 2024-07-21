"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column already exists
    const tableDefinition = await queryInterface.describeTable("User");
    if (!tableDefinition.confirmationToken) {
      await queryInterface.addColumn("User", "confirmationToken", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Check if the column exists before trying to remove it
    const tableDefinition = await queryInterface.describeTable("User");
    if (tableDefinition.confirmationToken) {
      await queryInterface.removeColumn("User", "confirmationToken");
    }
  },
};

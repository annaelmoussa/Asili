"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("User");
    if (!tableDefinition.confirmationToken) {
      await queryInterface.addColumn("User", "confirmationToken", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("User");
    if (tableDefinition.confirmationToken) {
      await queryInterface.removeColumn("User", "confirmationToken");
    }
  },
};

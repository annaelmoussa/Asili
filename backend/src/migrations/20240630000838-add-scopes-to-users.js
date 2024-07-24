"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable("User");
    if (!tableInfo.scopes) {
      await queryInterface.addColumn("User", "scopes", {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable("User");
    if (tableInfo.scopes) {
      await queryInterface.removeColumn("User", "scopes");
    }
  },
};

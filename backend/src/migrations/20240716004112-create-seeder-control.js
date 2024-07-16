"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("SeederControl", {
      name: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      executed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      executedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("SeederControl");
  },
};

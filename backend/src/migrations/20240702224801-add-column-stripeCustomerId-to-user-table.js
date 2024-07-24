"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("User");
    if (!tableInfo.stripeCustomerId) {
      await queryInterface.addColumn("User", "stripeCustomerId", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("User");
    if (tableInfo.stripeCustomerId) {
      await queryInterface.removeColumn("User", "stripeCustomerId");
    }
  },
};

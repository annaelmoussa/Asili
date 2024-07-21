"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Vérifier si la colonne existe déjà
    const tableInfo = await queryInterface.describeTable("User");
    if (!tableInfo.stripeCustomerId) {
      await queryInterface.addColumn("User", "stripeCustomerId", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Vérifier si la colonne existe avant de la supprimer
    const tableInfo = await queryInterface.describeTable("User");
    if (tableInfo.stripeCustomerId) {
      await queryInterface.removeColumn("User", "stripeCustomerId");
    }
  },
};

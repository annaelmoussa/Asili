"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable("User");
    if (!tableInfo.lastPasswordChange) {
      await queryInterface.addColumn("User", "lastPasswordChange", {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      });
      console.log("Colonne lastPasswordChange ajoutée avec succès.");
    } else {
      console.log(
        "La colonne lastPasswordChange existe déjà. Aucune action nécessaire."
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable("User");
    if (tableInfo.lastPasswordChange) {
      await queryInterface.removeColumn("User", "lastPasswordChange");
      console.log("Colonne lastPasswordChange supprimée avec succès.");
    } else {
      console.log(
        "La colonne lastPasswordChange n'existe pas. Aucune action nécessaire."
      );
    }
  },
};

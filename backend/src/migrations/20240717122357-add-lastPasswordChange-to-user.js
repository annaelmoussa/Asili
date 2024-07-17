'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('User', 'lastPasswordChange', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('User', 'lastPasswordChange');
  }
};

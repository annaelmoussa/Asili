'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('User', 'stripeCustomerId', {
        type: Sequelize.STRING,
        allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('User', 'stripeCustomerId');
  }
};
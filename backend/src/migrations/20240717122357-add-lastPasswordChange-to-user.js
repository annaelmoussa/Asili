'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            await queryInterface.removeColumn('User', 'lastPasswordChange');
        } catch (error) {
            console.log('Column does not exist, proceeding to add it.');
        }

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
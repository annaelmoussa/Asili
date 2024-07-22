'use strict';

module.exports = {
    async up (queryInterface, Sequelize) {
        const tableInfo = await queryInterface.describeTable('Payment');
        if (!tableInfo.orderId) {
            await queryInterface.addColumn('Payment', 'orderId', {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Order',
                    key: 'id'
                }
            });
        }
    },

    async down (queryInterface, Sequelize) {
        const tableInfo = await queryInterface.describeTable('Payment');
        if (tableInfo.orderId) {
            await queryInterface.removeColumn('Payment', 'orderId');
        }
    }
};
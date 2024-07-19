'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('OrderItem', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },
            orderId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Order',
                    key: 'id'
                }
            },
            productId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Product',
                    key: 'id'
                }
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            priceAtPurchase: {
                type: Sequelize.DOUBLE,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('OrderItem');
    }
};
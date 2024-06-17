module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("UserPreferences", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      alertNewProduct: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      alertRestock: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      alertPriceChange: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      newsletterSubscription: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("UserPreferences");
  },
};

"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const productsCount = await queryInterface.rawSelect(
      "Products",
      {
        where: {},
      },
      ["id"]
    );

    if (!productsCount) {
      await queryInterface.bulkInsert("Products", [
        {
          id: Sequelize.literal("uuid_generate_v4()"),
          name: "Product 1",
          description: "Description for product 1",
          price: 10.99,
          category: "Category 1",
          stock: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: Sequelize.literal("uuid_generate_v4()"),
          name: "Product 2",
          description: "Description for product 2",
          price: 12.99,
          category: "Category 2",
          stock: 150,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: Sequelize.literal("uuid_generate_v4()"),
          name: "Product 3",
          description: "Description for product 3",
          price: 9.99,
          category: "Category 1",
          stock: 200,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: Sequelize.literal("uuid_generate_v4()"),
          name: "Product 4",
          description: "Description for product 4",
          price: 14.99,
          category: "Category 3",
          stock: 120,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: Sequelize.literal("uuid_generate_v4()"),
          name: "Product 5",
          description: "Description for product 5",
          price: 11.49,
          category: "Category 2",
          stock: 300,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: Sequelize.literal("uuid_generate_v4()"),
          name: "Product 6",
          description: "Description for product 6",
          price: 8.99,
          category: "Category 3",
          stock: 50,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: Sequelize.literal("uuid_generate_v4()"),
          name: "Product 7",
          description: "Description for product 7",
          price: 15.99,
          category: "Category 1",
          stock: 400,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: Sequelize.literal("uuid_generate_v4()"),
          name: "Product 8",
          description: "Description for product 8",
          price: 13.99,
          category: "Category 2",
          stock: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: Sequelize.literal("uuid_generate_v4()"),
          name: "Product 9",
          description: "Description for product 9",
          price: 7.99,
          category: "Category 3",
          stock: 250,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: Sequelize.literal("uuid_generate_v4()"),
          name: "Product 10",
          description: "Description for product 10",
          price: 10.49,
          category: "Category 1",
          stock: 500,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
  },
};

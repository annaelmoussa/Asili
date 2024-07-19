"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    const productsCount = await queryInterface.rawSelect(
      "Product",
      {
        where: {},
      },
      ["id"]
    );

    if (!productsCount) {
      const brands = await queryInterface.sequelize.query(
        `SELECT id, name FROM "Brand";`
      );
      const categories = await queryInterface.sequelize.query(
        `SELECT id, name FROM "Category";`
      );

      const brandMap = brands[0].reduce((acc, brand) => {
        acc[brand.name] = brand.id;
        return acc;
      }, {});

      const categoryMap = categories[0].reduce((acc, category) => {
        acc[category.name] = category.id;
        return acc;
      }, {});

      await queryInterface.bulkInsert("Product", [
        // Protéines
        {
          id: uuidv4(),
          name: "Whey Protein Isolate",
          description:
            "Protéine de lactosérum pure et isolée pour une absorption rapide.",
          price: 29.99,
          brandId: brandMap["ProteinPower"],
          categoryId: categoryMap["Proteins"],
          stock: 100,
          image:
            "https://cdn.midjourney.com/a1f4b642-d230-464a-8d83-c4b06b8f0f61/0_3.png",
          isPromotion: false,
          lowStockThreshold: 20,
          stockHistory: JSON.stringify([{ date: new Date(), quantity: 100 }]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "Casein Night Protein",
          description: "Protéine à libération lente idéale pour la nuit.",
          price: 27.99,
          brandId: brandMap["MuscleMax"],
          categoryId: categoryMap["Proteins"],
          stock: 80,
          image:
            "https://cdn.midjourney.com/b5fc98a2-acde-48aa-8230-c9a0cb9e0d92/0_3.png",
          isPromotion: true,
          lowStockThreshold: 15,
          stockHistory: JSON.stringify([{ date: new Date(), quantity: 80 }]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // Barres/Snacks & Boissons
        {
          id: uuidv4(),
          name: "Protein Bar Chocolate",
          description: "Barre protéinée au goût chocolat, idéale en collation.",
          price: 2.49,
          brandId: brandMap["NutriSnack"],
          categoryId: categoryMap["Snacks"],
          stock: 200,
          image:
            "https://cdn.midjourney.com/49dde191-9274-4a0d-8a7a-8b767535273b/0_3.png",
          isPromotion: false,
          lowStockThreshold: 50,
          stockHistory: JSON.stringify([{ date: new Date(), quantity: 200 }]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "Energy Drink Zero",
          description: "Boisson énergisante sans sucre pour un boost immédiat.",
          price: 1.99,
          brandId: brandMap["EnergyFuel"],
          categoryId: categoryMap["Snacks"],
          stock: 150,
          image:
            "https://cdn.midjourney.com/3dfccccf-1e87-4e51-8d43-6f98a67ea5ae/0_2.png",
          isPromotion: true,
          lowStockThreshold: 30,
          stockHistory: JSON.stringify([{ date: new Date(), quantity: 150 }]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // Vêtements
        {
          id: uuidv4(),
          name: "T-shirt Compression",
          description:
            "T-shirt de compression pour un meilleur soutien musculaire.",
          price: 34.99,
          brandId: brandMap["FitWear"],
          categoryId: categoryMap["Clothing"],
          stock: 50,
          image:
            "https://cdn.midjourney.com/e0cdf856-0fae-4926-ba8e-0c9376341631/0_2.png",
          isPromotion: false,
          lowStockThreshold: 10,
          stockHistory: JSON.stringify([{ date: new Date(), quantity: 50 }]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "Legging Fitness",
          description:
            "Legging respirant et extensible pour tous types d'entraînements.",
          price: 29.99,
          brandId: brandMap["FitWear"],
          categoryId: categoryMap["Clothing"],
          stock: 75,
          image:
            "https://cdn.midjourney.com/360bdfff-2cda-4d93-9b93-0df59105dccf/0_3.png",
          isPromotion: true,
          lowStockThreshold: 15,
          stockHistory: JSON.stringify([{ date: new Date(), quantity: 75 }]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // Créatines
        {
          id: uuidv4(),
          name: "Créatine Monohydrate",
          description:
            "Créatine pure pour augmenter la force et la masse musculaire.",
          price: 19.99,
          brandId: brandMap["CreatineForce"],
          categoryId: categoryMap["Creatines"],
          stock: 120,
          image:
            "https://cdn.midjourney.com/a93d2c98-deac-4e77-a335-41f0f5117fd5/0_1.png",
          isPromotion: false,
          lowStockThreshold: 25,
          stockHistory: JSON.stringify([{ date: new Date(), quantity: 120 }]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "Créatine HCL",
          description: "Créatine hydrochlorée pour une meilleure absorption.",
          price: 24.99,
          brandId: brandMap["PurePump"],
          categoryId: categoryMap["Creatines"],
          stock: 90,
          image:
            "https://cdn.midjourney.com/25879c9b-519f-48ee-a863-04b9eef071f0/0_3.png",
          isPromotion: true,
          lowStockThreshold: 20,
          stockHistory: JSON.stringify([{ date: new Date(), quantity: 90 }]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // Vitamines
        {
          id: uuidv4(),
          name: "Multivitamines Daily",
          description:
            "Complexe multivitaminé complet pour une santé optimale.",
          price: 15.99,
          brandId: brandMap["VitaBoost"],
          categoryId: categoryMap["Vitamins"],
          stock: 200,
          image:
            "https://cdn.midjourney.com/cc31784d-b3ae-4347-b16f-ba4085f73db3/0_0.png",
          isPromotion: false,
          lowStockThreshold: 40,
          stockHistory: JSON.stringify([{ date: new Date(), quantity: 200 }]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "Vitamine D3 + K2",
          description:
            "Combinaison synergique de vitamines D3 et K2 pour la santé osseuse.",
          price: 12.99,
          brandId: brandMap["NaturePlus"],
          categoryId: categoryMap["Vitamins"],
          stock: 150,
          image:
            "https://cdn.midjourney.com/a5af5e1b-b7a2-453d-b32f-b52053e3ce41/0_0.png",
          isPromotion: true,
          lowStockThreshold: 30,
          stockHistory: JSON.stringify([{ date: new Date(), quantity: 150 }]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // Végan
        {
          id: uuidv4(),
          name: "Protéine de Pois Bio",
          description:
            "Protéine végétale pure issue de l'agriculture biologique.",
          price: 22.99,
          brandId: brandMap["VeganVitality"],
          categoryId: categoryMap["Vegan"],
          stock: 80,
          image:
            "https://cdn.midjourney.com/88e2ec6c-b1e1-4b0c-a484-740b1ea1d9c5/0_3.png",
          isPromotion: false,
          lowStockThreshold: 15,
          stockHistory: JSON.stringify([{ date: new Date(), quantity: 80 }]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "Barre Végan Fruits Rouges",
          description: "Barre énergétique 100% végétale aux fruits rouges.",
          price: 2.49,
          brandId: brandMap["GreenGains"],
          categoryId: categoryMap["Vegan"],
          stock: 120,
          image:
            "https://cdn.midjourney.com/d1ff406c-4c17-4cbe-b8b8-0a9e4f252e8d/0_0.png",
          isPromotion: true,
          lowStockThreshold: 25,
          stockHistory: JSON.stringify([{ date: new Date(), quantity: 120 }]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Product", null, {});
  },
};

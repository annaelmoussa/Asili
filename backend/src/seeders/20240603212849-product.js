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
          name: "Protéine Whey Isolate",
          description:
            "Protéine de lactosérum pure pour une absorption rapide.",
          price: 29.99,
          brandId: brandMap["ProtéinePure"],
          categoryId: categoryMap["Protéines"],
          stock: 100,
          image: "/uploads/protein-whey-isolate.png",
          isPromotion: false,
          lowStockThreshold: 20,
          stockHistory: JSON.stringify([{ date: new Date(), quantity: 100 }]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "Protéine Caséine",
          description: "Protéine à libération lente idéale pour la nuit.",
          price: 27.99,
          brandId: brandMap["ProtéinePure"],
          categoryId: categoryMap["Protéines"],
          stock: 80,
          image: "/uploads/protein-caseine.png",
          isPromotion: true,
          lowStockThreshold: 15,
          stockHistory: JSON.stringify([{ date: new Date(), quantity: 80 }]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // Collagène
        {
          id: uuidv4(),
          name: "Collagène Marin",
          description:
            "Collagène marin pour la santé de la peau et des articulations.",
          price: 24.99,
          brandId: brandMap["CollagèneNature"],
          categoryId: categoryMap["Collagène"],
          stock: 90,
          image: "/uploads/collagene-marin.png",
          isPromotion: true,
          lowStockThreshold: 20,
          stockHistory: JSON.stringify([{ date: new Date(), quantity: 90 }]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "Collagène Bovin",
          description:
            "Collagène bovin pour soutenir la santé des articulations.",
          price: 19.99,
          brandId: brandMap["CollagèneNature"],
          categoryId: categoryMap["Collagène"],
          stock: 120,
          image: "/uploads/collagene-bovin.png",
          isPromotion: false,
          lowStockThreshold: 25,
          stockHistory: JSON.stringify([{ date: new Date(), quantity: 120 }]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // Vitamines
        {
          id: uuidv4(),
          name: "Multivitamines Quotidien",
          description:
            "Complexe multivitaminé complet pour une santé optimale.",
          price: 15.99,
          brandId: brandMap["VitaBoost"],
          categoryId: categoryMap["Vitamines"],
          stock: 200,
          image: "/uploads/multivitamines-quotidien.png",
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
          brandId: brandMap["VitaBoost"],
          categoryId: categoryMap["Vitamines"],
          stock: 150,
          image: "/uploads/vitamine-d3-k2.png",
          isPromotion: true,
          lowStockThreshold: 30,
          stockHistory: JSON.stringify([{ date: new Date(), quantity: 150 }]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // Minéraux
        {
          id: uuidv4(),
          name: "Magnésium Complet",
          description:
            "Magnésium pour réduire la fatigue et améliorer la récupération.",
          price: 14.99,
          brandId: brandMap["MineralMax"],
          categoryId: categoryMap["Minéraux"],
          stock: 130,
          image: "/uploads/magnesium-complet.png",
          isPromotion: false,
          lowStockThreshold: 25,
          stockHistory: JSON.stringify([{ date: new Date(), quantity: 130 }]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "Zinc + Vitamine C",
          description: "Zinc avec vitamine C pour le soutien immunitaire.",
          price: 11.99,
          brandId: brandMap["MineralMax"],
          categoryId: categoryMap["Minéraux"],
          stock: 170,
          image: "/uploads/zinc-vitamine-c.png",
          isPromotion: true,
          lowStockThreshold: 35,
          stockHistory: JSON.stringify([{ date: new Date(), quantity: 170 }]),
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
          brandId: brandMap["CréatinePlus"],
          categoryId: categoryMap["Créatines"],
          stock: 120,
          image: "/uploads/creatine-monohydrate.png",
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
          brandId: brandMap["CréatinePlus"],
          categoryId: categoryMap["Créatines"],
          stock: 90,
          image: "/uploads/creatine-hcl.png",
          isPromotion: true,
          lowStockThreshold: 20,
          stockHistory: JSON.stringify([{ date: new Date(), quantity: 90 }]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // Acides Aminés
        {
          id: uuidv4(),
          name: "BCAA 2:1:1",
          description:
            "Acides aminés à chaîne ramifiée pour la récupération musculaire.",
          price: 21.99,
          brandId: brandMap["AminoPower"],
          categoryId: categoryMap["Acides Aminés"],
          stock: 110,
          image: "/uploads/bcaa-211.png",
          isPromotion: false,
          lowStockThreshold: 20,
          stockHistory: JSON.stringify([{ date: new Date(), quantity: 110 }]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: "L-Glutamine",
          description:
            "Acide aminé pour la récupération et la santé intestinale.",
          price: 18.99,
          brandId: brandMap["AminoPower"],
          categoryId: categoryMap["Acides Aminés"],
          stock: 95,
          image: "/uploads/l-glutamine.png",
          isPromotion: true,
          lowStockThreshold: 20,
          stockHistory: JSON.stringify([{ date: new Date(), quantity: 95 }]),
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

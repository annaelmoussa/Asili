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
          name: "Vitalité Plus",
          description:
            "Un complément multivitaminé complet pour soutenir votre énergie et votre vitalité au quotidien.",
          price: 15.99,
          category: "Multivitamines",
          stock: 200,
          image:
            "https://cdn.midjourney.com/98e0e79d-63ee-4208-88d0-7b7c6264f77f/0_2.png",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: Sequelize.literal("uuid_generate_v4()"),
          name: "Omega-3 Ultra",
          description:
            "Riche en acides gras oméga-3 pour favoriser la santé cardiaque et cognitive.",
          price: 18.99,
          category: "Acides Gras Essentiels",
          stock: 150,
          image:
            "https://cdn.midjourney.com/5a314a1c-5657-4a85-b665-16f5048d2985/0_3.png",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: Sequelize.literal("uuid_generate_v4()"),
          name: "Défense Immunitaire",
          description:
            "Renforcez vos défenses naturelles avec ce mélange de vitamines et de minéraux essentiels.",
          price: 12.99,
          category: "Immunité",
          stock: 300,
          image:
            "https://cdn.midjourney.com/14229650-e3f5-427f-b159-dae10205323c/0_2.png",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: Sequelize.literal("uuid_generate_v4()"),
          name: "Détente Naturelle",
          description:
            "Formule apaisante à base de plantes pour réduire le stress et améliorer la qualité du sommeil.",
          price: 16.99,
          category: "Relaxation",
          stock: 120,
          image:
            "https://cdn.midjourney.com/2009f867-38bf-40d1-a833-f6b523fb2aea/0_2.png",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: Sequelize.literal("uuid_generate_v4()"),
          name: "Probiotiques Plus",
          description:
            "Favorise une digestion saine et un microbiote équilibré avec 10 souches de probiotiques.",
          price: 19.99,
          category: "Digestion",
          stock: 180,
          image:
            "https://cdn.midjourney.com/0d92d2b6-8c9d-4469-8c83-1b59af0a91fb/0_0.png",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: Sequelize.literal("uuid_generate_v4()"),
          name: "Articulations Flex",
          description:
            "Soutenez la santé de vos articulations avec cette formule enrichie en glucosamine et chondroïtine.",
          price: 22.49,
          category: "Articulations",
          stock: 130,
          image:
            "https://cdn.midjourney.com/93e4bac4-eb66-4deb-8cfe-c07a7662fdc8/0_2.png",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: Sequelize.literal("uuid_generate_v4()"),
          name: "Énergie Max",
          description:
            "Booster votre énergie et combattre la fatigue avec ce mélange de vitamines B et de caféine naturelle.",
          price: 14.99,
          category: "Énergie",
          stock: 250,
          image:
            "https://cdn.midjourney.com/eb2b3189-1469-4adb-8deb-071d88af3e74/0_0.png",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: Sequelize.literal("uuid_generate_v4()"),
          name: "Beauté de la Peau",
          description:
            "Améliorez l'éclat de votre peau grâce à une combinaison de collagène et d'antioxydants.",
          price: 21.99,
          category: "Beauté",
          stock: 170,
          image:
            "https://cdn.midjourney.com/7bad6e3e-cfe6-4c27-abdc-a49612f0af8a/0_2.png",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: Sequelize.literal("uuid_generate_v4()"),
          name: "Mémoire Plus",
          description:
            "Supporte la mémoire et la concentration avec du ginkgo biloba et des vitamines essentielles.",
          price: 17.99,
          category: "Cerveau",
          stock: 140,
          image:
            "https://cdn.midjourney.com/c12825ba-e6e9-4d0b-94b7-3f6559a85211/0_2.png",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: Sequelize.literal("uuid_generate_v4()"),
          name: "Détente Digestive",
          description:
            "Un mélange apaisant de fibres et d'enzymes pour une digestion sans tracas.",
          price: 13.49,
          category: "Digestion",
          stock: 210,
          image:
            "https://cdn.midjourney.com/1710f69a-2f5c-494b-9e37-b350081d6165/0_0.png",
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

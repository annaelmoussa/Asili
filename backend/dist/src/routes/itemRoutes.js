"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemRoutes = void 0;
const itemRoutes = (app) => {
    /**
     * @swagger
     * /items:
     *   get:
     *     summary: Get all items
     *     responses:
     *       200:
     *         description: Returns a list of items.
     */
    app.get("/items", (req, res) => {
        res.status(200).send([{ id: 1, name: "Item 1" }]);
    });
    /**
     * @swagger
     * /items:
     *   post:
     *     summary: Create an item
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 description: Name of the item
     *     responses:
     *       201:
     *         description: Item added successfully
     */
    app.post("/items", (req, res) => {
        res.status(201).send({ id: 2, name: req.body.name });
    });
};
exports.itemRoutes = itemRoutes;

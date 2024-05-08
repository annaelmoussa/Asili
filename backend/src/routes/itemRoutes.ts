import { Application, Request, Response } from "express";

export const itemRoutes = (app: Application) => {
  /**
   * @swagger
   * /items:
   *   get:
   *     summary: Get all items
   *     responses:
   *       200:
   *         description: Returns a list of items.
   */
  app.get("/items", (req: Request, res: Response) => {
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
  app.post("/items", (req: Request, res: Response) => {
    res.status(201).send({ id: 2, name: req.body.name });
  });
};

import express, { Router } from 'express';
import { getStocks, createStock } from '../controllers/stockController';

const router = Router();

/**
 * @swagger
 * /api/stocks:
 *   get:
 *     summary: Get all stocks
 *     tags: [Stocks]
 *     responses:
 *       200:
 *         description: List of all stocks
 *       500:
 *         description: Server error
 */
router.get('/stocks', getStocks);

/**
 * @swagger
 * /api/stocks:
 *   post:
 *     summary: Create a new stock entry
 *     tags: [Stocks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Stock entry created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/stocks', createStock);

export const stockRoutes = (app: express.Application) => {
  app.use('/api', router);
};

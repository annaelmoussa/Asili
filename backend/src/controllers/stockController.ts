import { Request, Response, NextFunction } from "express";
import { IStock } from "../interfaces/IStock";
import stockService from "../services/stockService";

export const getStocks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stocks = await stockService.findAll();
    res.status(200).json(stocks);
  } catch (error) {
    next(error);
  }
};

export const createStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newStock = await stockService.create(req.body as IStock);
    res.status(201).json(newStock);
  } catch (error) {
    next(error);
  }
};


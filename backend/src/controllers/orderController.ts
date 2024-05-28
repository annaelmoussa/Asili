import { Request, Response, NextFunction } from 'express';
import orderService from '../services/orderService';
import { IOrder } from '../interfaces/IOrder';

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await orderService.findAll();
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newOrder = await orderService.create(req.body as IOrder);
        res.status(201).json(newOrder);
    } catch (error) {
        next(error);
    }
};


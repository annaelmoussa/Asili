import { Request, Response, NextFunction } from 'express';
import productService from '../services/productService';
import { IProduct } from '../interfaces/IProduct';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await productService.findAll();
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newProduct = await productService.create(req.body as IProduct);
        res.status(201).json(newProduct);
    } catch (error) {
        next(error);
    }
};


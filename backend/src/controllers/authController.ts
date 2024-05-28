import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService';
import { IAuth } from '../interfaces/IAuth';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser = await authService.register(req.body as IAuth);
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};



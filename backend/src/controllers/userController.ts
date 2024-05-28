import { Request, Response, NextFunction } from 'express';
import userService from '../services/userService';
import { IUser } from '../interfaces/IUser';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.findAll();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser = await userService.create(req.body as IUser);
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};


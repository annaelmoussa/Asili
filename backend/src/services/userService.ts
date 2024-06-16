import User from "../models/User";
import { IUser } from "../interfaces/IUser";
import { Transaction } from "sequelize";

export class UserService {
  public async get(
    userId: string,
    options?: { transaction?: Transaction }
  ): Promise<IUser | null> {
    try {
      const user = await User.findByPk(userId, options);
      return user ? (user.toJSON() as IUser) : null;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  }

  public async getAll(options?: {
    transaction?: Transaction;
  }): Promise<IUser[]> {
    try {
      const users = await User.findAll(options);
      return users.map((user) => user.toJSON() as IUser);
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  }

  public async create(
    user: IUser,
    options?: { transaction?: Transaction }
  ): Promise<IUser> {
    try {
      const newUser = await User.create(user, options);
      return newUser.toJSON() as IUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  public async update(
    userId: string,
    updateUser: IUser,
    options?: { transaction?: Transaction }
  ): Promise<IUser | null> {
    try {
      const user = await User.findByPk(userId, options);
      if (user) {
        await user.update(updateUser, options);
        return user.toJSON() as IUser;
      }
      return null;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  public async delete(
    userId: string,
    options?: { transaction?: Transaction }
  ): Promise<void> {
    try {
      const user = await User.findByPk(userId, options);
      if (user) {
        await user.destroy(options);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}

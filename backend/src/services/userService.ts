import User from "../models/User";
import { IUser } from "../interfaces/IUser";
import { ALL_SCOPES } from "../config/scopes";
import { v4 as uuidv4 } from "uuid";
import { DataTypes, Op, Sequelize, Transaction } from "sequelize";
import { sequelize as defaultSequelize } from "../config/dbConfigPostgres";
import bcrypt from "bcrypt";
import Widget from "../models/Widget";
import { differenceInDays } from "date-fns";

export class UserService {

  private sequelize: Sequelize;
  constructor(sequelize?: Sequelize) {
    this.sequelize = sequelize || defaultSequelize;
  }
  public async get(
    userId: string,
    options?: { transaction?: Transaction }
  ): Promise<IUser | null> {
    try {
      const user = await User.findOne({
        where: { id: userId, isDeleted: false },
        ...options,
      });
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
      const users = await User.findAll({
        where: { isDeleted: false },
        ...options,
      });
      return users.map((user) => user.toJSON() as IUser);
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  }

  public async create(
    userCreationParams: userCreationParams,
    user: IUser,
    options?: { transaction?: Transaction }
  ): Promise<IUser> {
    const t = options?.transaction || (await User.sequelize!.transaction());

    try {
      const existingDeletedUser = await User.findOne({
        where: { email: user.email, isDeleted: true },
        transaction: t,
      });

      if (existingDeletedUser) {
        const newUser = await User.create(
          {
            ...user,
            id: uuidv4(),
          },
          { transaction: t }
        );

        if (!options?.transaction) {
          await t.commit();
        }

        return newUser.toJSON() as IUser;
      } else {
        if (user.role === "ROLE_ADMIN") {
          user.scopes = ALL_SCOPES;
        }

        const newUser = await User.create(user, { transaction: t, userCreationParams });

        if (!options?.transaction) {
          await t.commit();
        }

        return newUser.toJSON() as IUser;
      }
    } catch (error) {
      if (!options?.transaction) {
        await t.rollback();
      }
      console.error("Error creating user:", error);
      throw error;
    }
  }

  public async update(
    userId: string,
    updateUser: Partial<IUser>,
    options?: { transaction?: Transaction }
  ): Promise<IUser | null> {
    try {
      const user = await User.findOne({
        where: { id: userId, isDeleted: false },
        ...options,
      });
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

  public async softDelete(
    userId: string,
    options?: { transaction?: Transaction }
  ): Promise<void> {
    const t = options?.transaction || (await User.sequelize!.transaction());

    try {
      const user = await User.findOne({
        where: { id: userId, isDeleted: false },
        transaction: t,
      });
      if (user) {
        const anonymousEmail = `deleted-${uuidv4()}@example.com`;
        const anonymousPassword = await bcrypt.hash(uuidv4(), 10);

        await user.update(
          {
            email: anonymousEmail,
            password: anonymousPassword,
            isDeleted: true,
          },
          { transaction: t }
        );

        await Widget.destroy({ where: { userId: user.id }, transaction: t });
      }

      if (!options?.transaction) {
        await t.commit();
      }
    } catch (error) {
      if (!options?.transaction) {
        await t.rollback();
      }
      console.error("Error soft deleting user:", error);
      throw error;
    }
  }

  public async delete(
    userId: string,
    options?: { transaction?: Transaction }
  ): Promise<void> {
    return this.softDelete(userId, options);
  }

  public async shouldChangePassword(userId: string): Promise<boolean> {
    const user = await User.findByPk(userId);
    if (!user) {
      console.log("User not found for userId:", userId);
      throw new Error("User not found");
    }
    const daysSinceLastChange = differenceInDays(
      new Date(),
      user.lastPasswordChange
    );
    return daysSinceLastChange >= 60;
  }
}

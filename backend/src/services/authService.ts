import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import {TokenBlacklist} from "../models/TokenBlacklist";
import { IUser } from "../interfaces/IUser";

const secret = process.env.JWT_SECRET || "your_jwt_secret";

export class AuthService {
  async login(
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, secret, {
      expiresIn: "1h",
    });

    return { user: user.toJSON() as IUser, token };
  }

  async signup(email: string, password: string): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      role: "ROLE_USER",
      isConfirmed: false,
    });

    return user.toJSON() as IUser;
  }

  async logout(token: string): Promise<void> {
    await TokenBlacklist.create({ token });
  }

  async getUser(token: string): Promise<IUser | null> {
    try {
      const decoded: any = jwt.verify(token, secret);
      const user = await User.findByPk(decoded.userId);
      return user ? (user.toJSON() as IUser) : null;
    } catch (error) {
      return null;
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await TokenBlacklist.findOne({ where: { token } });
    return !!blacklistedToken;
  }
}

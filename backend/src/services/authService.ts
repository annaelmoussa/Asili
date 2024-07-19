import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import TokenBlacklist from "../models/TokenBlacklist";
import { IUser } from "../interfaces/IUser";
import { IJwtPayload } from "../interfaces/IJwtPayload";

export class AuthService {
  private secret = process.env.JWT_SECRET || "your_jwt_secret";

  async login(
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }

    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      scopes: user.scopes,
      password: user.password,
    };

    const token = jwt.sign(payload, this.secret, {
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
      const decoded = jwt.verify(token, this.secret) as IJwtPayload;
      const user = await User.findByPk(decoded.id);
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

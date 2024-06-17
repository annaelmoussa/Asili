import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { TokenBlacklist } from "../models/TokenBlacklist";
import { IUser } from "../interfaces/IUser";
import sendEmail from "./emailService";

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

    if (!user.isConfirmed) {
      throw new Error("Please confirm your email address");
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, secret, {
      expiresIn: "1h",
    });

    return { user: user.toJSON() as IUser, token };
  }

  async signup(email: string, password: string): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationToken = jwt.sign({ email }, secret, { expiresIn: "1h" });

    const user = await User.create({
      email,
      password: hashedPassword,
      role: "ROLE_USER",
      isConfirmed: false,
      confirmationToken: confirmationToken,
    });

    const confirmationLink = `http://localhost:3000/auth/confirm?token=${confirmationToken}`;
    await sendEmail(
      email,
      "Please confirm your account",
      `Click the following link to confirm your account: ${confirmationLink}`
    );

    return user.toJSON() as IUser;
  }

  async confirmEmail(token: string): Promise<IUser | null> {
    try {
      const decoded: any = jwt.verify(token, secret);
      const user = await User.findOne({ where: { confirmationToken: token, email: decoded.email } });
      if (!user) {
        throw new Error("User not found");
      }
      user.isConfirmed = true;
      user.confirmationToken = ""; // Clear the token
      await user.save();
      return user.toJSON() as IUser;
    } catch (error) {
      return null;
    }
  }

  public async resendConfirmationEmail(email: string): Promise<void> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.isConfirmed) {
      throw new Error("Account already confirmed");
    }
  
    const confirmationToken = jwt.sign({ email: user.email }, secret, { expiresIn: "1h" });
    user.confirmationToken = confirmationToken;
    await user.save();
  
    const confirmationLink = `http://localhost:3000/auth/confirm?token=${confirmationToken}`;
    await sendEmail(
      email,
      "Please confirm your account",
      `Click the following link to confirm your account: ${confirmationLink}`
    );
  }
  

  public async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Si l'utilisateur n'existe pas, ne rien faire pour éviter les fuites d'information
      return;
    }

    const token = jwt.sign({ email: user.email, id: user.id }, secret, { expiresIn: '1h' });

    const resetLink = `http://localhost:8080/reset-password?token=${token}`;
    const emailText = `Click here to reset your password: ${resetLink}`;
    const emailHtml = `<a href="${resetLink}">Click here to reset your password</a>`;

    await sendEmail(user.email, "Password Reset", emailText, emailHtml);
  }

  public async resetPassword(token: string, password: string,confirm_password:string): Promise<void> {
    if(password !== confirm_password){
      throw new Error("Passwords do not match.");
    }
    try {
      const decoded = jwt.verify(token, secret) as { email: string, id: string };

      const user = await User.findOne({ where: { id: decoded.id, email: decoded.email } });
      if (!user) {
        throw new Error("Invalid token or user does not exist.");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();
    } catch (err) {
      throw new Error("Invalid or expired token.");
    }
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

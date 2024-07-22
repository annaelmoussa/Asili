import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import TokenBlacklist from "../models/TokenBlacklist";
import { IUser } from "../interfaces/IUser";
import { IJwtPayload } from "../interfaces/IJwtPayload";
import sendEmail from "./emailService";
import { UserService } from "./userService";
import { AlertService } from "./AlertService";

export class AuthService {
  private secret = process.env.JWT_SECRET || "your_jwt_secret";
  private refreshSecret =
    process.env.REFRESH_TOKEN_SECRET || "your_refresh_token_secret";
  private alertService: AlertService;
  private userService: UserService;

  constructor() {
    this.alertService = new AlertService();
    this.userService = new UserService();
  }

  async login(
    email: string,
    password: string
  ): Promise<{
    user: IUser;
    token: string;
    refreshToken: string;
    mustChangePassword: boolean;
  }> {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }

    if (!user.isConfirmed) {
      throw new Error("Please confirm your email address");
    }

    const needsChange = await this.userService.shouldChangePassword(user.id);
    // const needsChange = false;

    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      scopes: user.scopes,
    };

    const token = jwt.sign(payload, this.secret, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign({ id: user.id }, this.refreshSecret, {
      expiresIn: "7d",
    });

    console.log("Payload:", payload);
    console.log("Token:", token);

    return {
      user: user.toJSON() as IUser,
      token,
      refreshToken,
      mustChangePassword: needsChange,
    };
  }

  async signup(email: string, password: string): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationToken = jwt.sign({ email }, this.secret, {
      expiresIn: "1h",
    });

    const user = await User.create({
      email,
      password: hashedPassword,
      role: "ROLE_USER",
      isConfirmed: false,
      confirmationToken: confirmationToken,
    });

    await this.alertService.createAlertPreference(user.id);

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
      const decoded = jwt.verify(token, this.secret) as { email: string };
      const user = await User.findOne({
        where: { confirmationToken: token, email: decoded.email },
      });
      if (!user) {
        console.log("User not found for token 1:", token);
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
      console.log("User not found for token 287556:");
      throw new Error("User not found");
    }
    if (user.isConfirmed) {
      throw new Error("Account already confirmed");
    }

    const confirmationToken = jwt.sign({ email: user.email }, this.secret, {
      expiresIn: "1h",
    });
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
      // If the user doesn't exist, do nothing to avoid information leaks
      return;
    }

    const token = jwt.sign({ email: user.email, id: user.id }, this.secret, {
      expiresIn: "1h",
    });

    const resetLink = `http://localhost:8080/reset-password?token=${token}`;
    const emailText = `Click here to reset your password: ${resetLink}`;
    const emailHtml = `<a href="${resetLink}">Click here to reset your password</a>`;

    await sendEmail(user.email, "Password Reset", emailText, emailHtml);
  }

  public async resetPassword(
    token: string,
    password: string,
    confirm_password: string
  ): Promise<void> {
    if (password !== confirm_password) {
      throw new Error("Passwords do not match.");
    }
    try {
      const decoded = jwt.verify(token, this.secret) as {
        email: string;
        id: string;
      };
      const user = await User.findOne({
        where: { id: decoded.id, email: decoded.email },
      });
      if (!user) {
        throw new Error("Invalid token or user does not exist.");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.lastPasswordChange = new Date();
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

  async refreshToken(
    refreshToken: string
  ): Promise<{ token: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, this.refreshSecret) as {
        id: string;
      };
      const user = await User.findByPk(decoded.id);

      if (!user) {
        console.log("User not found for token 2568:");
        throw new Error("User not found");
      }

      const payload: IJwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
        scopes: user.scopes,
      };

      const newToken = jwt.sign(payload, this.secret, {
        expiresIn: "1h",
      });

      const newRefreshToken = jwt.sign({ id: user.id }, this.refreshSecret, {
        expiresIn: "7d",
      });

      return { token: newToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }

  async changePassword(
    userId: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void> {
    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    const user = await User.findByPk(userId);
    if (!user) {
      console.log("User not found for token 267:");
      throw new Error("User not found");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.lastPasswordChange = new Date();
    await user.save();

    // Optionally, you might want to invalidate all existing tokens for this user
    // This would require additional implementation in your token management system
  }
}

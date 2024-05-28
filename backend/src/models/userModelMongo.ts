import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../interfaces/IUser";

export type IUserMongo = IUser & Document;

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["USER", "STORE_KEEPER", "ADMIN", "COMPTA"],
    },
  },
  {
    timestamps: true,
  }
);

const UserMongo = mongoose.model<IUserMongo>("User", userSchema);

export default UserMongo;

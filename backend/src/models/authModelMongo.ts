import mongoose, { Document, Schema } from "mongoose";
import { IAuth } from "../interfaces/IAuth";

type IAuthDocument = IAuth & Document;

const authSchema: Schema = new Schema(
  {
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

const AuthMongo = mongoose.model<IAuthDocument>("Auth", authSchema);

export default AuthMongo;

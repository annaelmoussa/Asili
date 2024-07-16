import mongoose from "mongoose";
import { IBrand } from "../interfaces/IBrand";

const BrandSchema = new mongoose.Schema<IBrand>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
});

const BrandMongo = mongoose.model<IBrand>("Brand", BrandSchema);

export default BrandMongo;

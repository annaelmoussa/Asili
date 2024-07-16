import mongoose from "mongoose";
import { ICategory } from "../interfaces/ICategory";

const CategorySchema = new mongoose.Schema<ICategory>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
});

const CategoryMongo = mongoose.model<ICategory>("Category", CategorySchema);

export default CategoryMongo;

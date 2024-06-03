require("dotenv").config();

export const PORT = process.env.PORT ?? 3000;
export const MONGO_URI = process.env.MONGO_URI;
export const POSTGRES_URI = process.env.POSTGRES_URI;
export const JWT_SECRET = process.env.JWT_SECRET;

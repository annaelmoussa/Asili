import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";

dotenv.config();

const app: Application = express();
const port = process.env.PORT ?? 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server hot reload");
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

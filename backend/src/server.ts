import express from "express";
import { setupRoutes } from "./app";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


setupRoutes(app);

app.listen(port, () => {
  console.log(`Server running at <http://localhost>:${port}`);
});

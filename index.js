import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import getConnection from "./src/helper/databaseConnection.js";
import cors from "cors";
const port = process.env.PORT || 3000;
// import path from "path";
// const __dirname = path.resolve();
import router from "./routes.js";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));

router(app);
getConnection();

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});

import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import snippetRoutes from "./routes/snippets";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

//Connection db

connectDB();

app.use("/api/snippets", snippetRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

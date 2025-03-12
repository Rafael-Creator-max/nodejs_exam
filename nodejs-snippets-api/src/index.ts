import express from "express";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/database"; 
import snippetRoutes from "./routes/snippets";
import frontendRoutes from "./routes/frontendRoutes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

//  Set up EJS for views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

//  Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Routes
app.use("/api/snippets", snippetRoutes);
app.use("/", frontendRoutes);

// Connect to MongoDB & Start Server
connectDB().then(() => {
  app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
});

import express from "express";
import Snippet from "../models/Snippet";

const router = express.Router();

// POST 
router.post("/", async (req, res) => {
  try {
    const { title, code, language, tags, expiresIn } = req.body;
    const newSnippet = new Snippet({ title, code, language, tags, expiresIn });
    await newSnippet.save();
    res.status(201).json(newSnippet);
  } catch (error) {
    res.status(500).json({ error: "Failed to create snippet" });
  }
});

//GET 
router.get("/", async (req, res) => {
  try {
    const snippets = await Snippet.find();
    res.json(snippets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch snippets" });
  }
});

export default router;

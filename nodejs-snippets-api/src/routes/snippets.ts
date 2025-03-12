import express from "express";
import {
  createSnippet,
  getSnippets,
  getSnippetById,
  updateSnippet,
  deleteSnippet,
} from "../controllers/snippetController";
import { validateSnippet } from "../middleware/validateSnippet";

const router = express.Router();

// routes
router.post("/", validateSnippet, createSnippet);
router.get("/", getSnippets);
router.get("/:id", getSnippetById);
router.put("/:id", updateSnippet);
router.delete("/:id", deleteSnippet);

export default router;

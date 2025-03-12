import express, { Request, Response } from "express";
import Snippet from "../models/Snippet";

const router = express.Router();

//  GET  Render dashboard with snippets
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { language, tags } = req.query;
    let query: any = {};

    if (language) query.language = new RegExp(`^${language}$`, "i");
    if (tags) query.tags = { $all: (tags as string).split(",") };

    const snippets = await Snippet.find(query);
    res.render("index", { snippets });
  } catch (error) {
    console.error(" Error loading dashboard:", error);
    res.status(500).send("Error loading dashboard");
  }
});

//  GET /snippets/:id Render single snippet page
router.get(
  "/snippets/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const snippet = await Snippet.findById(req.params.id);
      if (!snippet) {
        res.status(404).send("Snippet not found");
        return;
      }

      res.render("snippet", { snippet });
    } catch (error) {
      console.error(" Error loading snippet:", error);
      res.status(500).send("Error loading snippet");
    }
  }
);

// GET /delete/:id  Delete a snippet
router.get(
  "/delete/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      await Snippet.findByIdAndDelete(req.params.id);
      res.redirect("/");
    } catch (error) {
      console.error(" Error deleting snippet:", error);
      res.status(500).send("Error deleting snippet");
    }
  }
);

export default router;

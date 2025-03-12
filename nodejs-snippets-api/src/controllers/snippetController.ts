import { Request, Response } from "express";
import Snippet from "../models/Snippet";

//  check if already Base64 encoded
const isBase64 = (str: string): boolean => {
  try {
    return Buffer.from(str, "base64").toString("base64") === str;
  } catch (err) {
    return false;
  }
};

// function to encode snippets
const encodeSnippet = (code: string): string => {
  return Buffer.from(code, "utf-8").toString("base64");
};

//   function to decode snippets
const decodeSnippet = (code: string): string => {
  return isBase64(code) ? Buffer.from(code, "base64").toString("utf-8") : code;
};

// POST - Create a new snippet with expiration & encoding
export const createSnippet = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, code, language, tags, expiresIn } = req.body;

    // Encode code before saving
    const encodedCode = isBase64(code) ? code : encodeSnippet(code);

    const newSnippet = new Snippet({
      title,
      code: encodedCode,
      language,
      tags,
      expiresIn: expiresIn || null,
    });

    await newSnippet.save();
    res.status(201).json(newSnippet);
  } catch (error) {
    console.error(" Error creating snippet:", error);
    res.status(500).json({ error: "Failed to create snippet" });
  }
};

//  GET  all snippets (excluding expired ones)
export const getSnippets = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      language,
      tags,
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    let query: any = {};

    if (language) query.language = new RegExp(`^${language}$`, "i");
    if (tags) query.tags = { $all: (tags as string).split(",") };

    //  Filter out expired snippets
    const now = new Date();
    query.$or = [
      { expiresIn: null },
      { createdAt: { $gt: new Date(now.getTime() - 3600000) } },
    ];

    const snippets = await Snippet.find(query)
      .sort({ [sort as string]: order === "desc" ? -1 : 1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    // Decode before returning
    const decodedSnippets = snippets.map((snippet) => ({
      ...snippet.toObject(),
      code: decodeSnippet(snippet.code),
    }));

    res.status(200).json(decodedSnippets);
  } catch (error) {
    console.error("Error fetching snippets:", error);
    res.status(500).json({ error: "Failed to fetch snippets" });
  }
};

//  GET 1 snippet (DECODES before returning)
export const getSnippetById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    if (!snippet) {
      res.status(404).json({ error: "Snippet not found" });
      return;
    }

    res.json({
      ...snippet.toObject(),
      code: decodeSnippet(snippet.code),
    });
  } catch (error) {
    console.error(" Error fetching snippet:", error);
    res.status(500).json({ error: "Failed to fetch snippet" });
  }
};

//  PUT Update a snippet (ENCODES before saving)
export const updateSnippet = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, code, language, tags, expiresIn } = req.body;

    const encodedCode = isBase64(code) ? code : encodeSnippet(code);

    const updatedSnippet = await Snippet.findByIdAndUpdate(
      req.params.id,
      { title, code: encodedCode, language, tags, expiresIn },
      { new: true }
    );

    if (!updatedSnippet) {
      res.status(404).json({ error: "Snippet not found" });
      return;
    }

    res.json(updatedSnippet);
  } catch (error) {
    console.error(" Error updating snippet:", error);
    res.status(500).json({ error: "Failed to update snippet" });
  }
};

//  DELETE  snippet
export const deleteSnippet = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedSnippet = await Snippet.findByIdAndDelete(req.params.id);
    if (!deletedSnippet) {
      res.status(404).json({ error: "Snippet not found" });
      return;
    }

    res.json({ message: "Snippet deleted successfully" });
  } catch (error) {
    console.error(" Error deleting snippet:", error);
    res.status(500).json({ error: "Failed to delete snippet" });
  }
};

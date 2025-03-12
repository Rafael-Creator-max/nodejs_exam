import { Request, Response, NextFunction } from "express";

export const validateSnippet = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { title, code, language } = req.body;

  if (!title || !code || !language) {
    res.status(400).json({ error: "Title, code, and language are required" });
    return;
  }

  next();
};

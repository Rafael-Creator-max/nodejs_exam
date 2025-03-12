import mongoose, { Schema, Document } from "mongoose";

// interface
export interface ISnippet extends Document {
  title: string;
  code: string;
  language: string;
  tags: string[];
  expiresIn?: number;
  createdAt: Date;
  updatedAt: Date;
}

//  Mongoose schema
const SnippetSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
    tags: { type: [String], default: [] },
    expiresIn: { type: Number, default: null },
  },
  { timestamps: true } // createdAt & updatedAt
);

const Snippet = mongoose.model<ISnippet>("Snippet", SnippetSchema);

export default mongoose.model<ISnippet>("Snippet", SnippetSchema);

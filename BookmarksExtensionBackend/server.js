import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import bodyParser from "body-parser";
import Groq from "groq-sdk";
import connectDB from "./db.js";
import { formatMemory } from "./groq.js";

import ArticleMemory from "./models/articleMemory.js";
import ProductMemory from "./models/productMemory.js";
import VideoMemory from "./models/videoMemory.js";
import authRoutes from "./routes/auth.js";
import { authMiddleware } from "./middleware/auth.js";



connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "20mb" }));

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


// ----------- ROUTE TO HANDLE EXTENSION REQUEST ----------------
app.post("/capture", authMiddleware, async (req, res) => {
  try {
    const raw = req.body;

    const formatted = await formatMemory(raw);

    let saved;

    if (formatted.type === "article") {
      saved = await ArticleMemory.create({
        ...formatted,
        raw,
        userId: req.userId,
      });
    } else if (formatted.type === "product") {
      saved = await ProductMemory.create({
        ...formatted,
        raw,
        userId: req.userId,
      });
    } else if (formatted.type === "video") {
      saved = await VideoMemory.create({
        ...formatted,
        raw,
        userId: req.userId,
      });
    } else {
      return res.status(400).json({ error: "Invalid type from Groq" });
    }

    res.json({ success: true, data: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});


app.get("/memories", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const articles = await ArticleMemory
      .find({ userId })
      .sort({ timestamp: -1 });

    const products = await ProductMemory
      .find({ userId })
      .sort({ timestamp: -1 });

    const videos = await VideoMemory
      .find({ userId })
      .sort({ timestamp: -1 });

    const allMemories = [...articles, ...products, ...videos];
    res.json(allMemories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


app.use("/auth", authRoutes);


// ---------------------------------------------------------------
// DELETE memory by id (article / product / video)
app.delete("/memories/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    let deleted =
      await ArticleMemory.findOneAndDelete({ _id: id, userId }) ||
      await ProductMemory.findOneAndDelete({ _id: id, userId }) ||
      await VideoMemory.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return res.status(404).json({ message: "Memory not found" });
    }

    res.json({ success: true, message: "Memory deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// SEARCH memories using Groq
app.post("/memories/search", authMiddleware, async (req, res) => {
  try {
    const { query } = req.body;
    const userId = req.userId;

    if (!query) {
      return res.status(400).json({ message: "Query required" });
    }

    const articles = await ArticleMemory.find({ userId });
    const products = await ProductMemory.find({ userId });
    const videos = await VideoMemory.find({ userId });

    const allMemories = [...articles, ...products, ...videos];

    if (allMemories.length === 0) return res.json([]);

    // Prepare minimal data for Groq
    const groqInput = allMemories.map((m) => ({
      id: m._id,
      type: m.type,
      title: m.title,
      content:
        m.summary ||
        m.description ||
        m.content ||
        "",
    }));

    const prompt = `
You are a search engine.

User query:
"${query}"

Memories:
${JSON.stringify(groqInput)}

Rules:
-check which memories are relevant to the query
- Return ONLY an array of IDs
- IDs must match the given memory IDs
- No explanation, no text
- JSON ONLY

Example:
["id1","id2"]
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });

    const ids = JSON.parse(response.choices[0].message.content);

    const results = allMemories.filter((m) =>
      ids.includes(m._id.toString())
    );

    res.json(results);
  } catch (err) {
    console.error(err);

    res.status(500).json({ message: "Search failed" });
  }
});


app.listen(3000, () => console.log("Server running on port 3000"));

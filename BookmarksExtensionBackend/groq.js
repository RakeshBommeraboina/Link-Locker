import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function formatMemory(raw) {
  const safeRaw = {
    url: raw.url,
    title: raw.title,
    content: raw.content
      ? raw.content.replace(/<[^>]+>/g, "").slice(0, 3000)
      : "",
    selectedText: raw.selectedText
      ? raw.selectedText.replace(/<[^>]+>/g, "").slice(0, 1000)
      : "",
  };

  const prompt = `
You are a JSON API.

You will be given raw website capture data.
Your task is to classify and format it.

STRICT RULES (VERY IMPORTANT):
- Return ONLY valid JSON
- Do NOT add explanations
- Do NOT add markdown
- Do NOT add text before or after JSON
- JSON must start with { and end with }

Raw input:
${JSON.stringify(safeRaw)}

Decide the type:
- "article"
- "product"
- "video"

Return ONE of the following schemas ONLY.
and if there is description or summary field, give a brief summary (1-2 sentences).

ARTICLE:
{
  "type": "article",
  "url": "",
  "title": "",
  "content": "",
  "summary": "",
  "author": "",
  "publishedDate": "",
  "timestamp": 0
}

PRODUCT:
{
  "type": "product",
  "url": "",
  "title": "",
  "price": "",
  "description": "",
  "rating": "",
  "timestamp": 0
}

VIDEO:
{
  "type": "video",
  "url": "",
  "title": "",
  "channelName": "",
  "description": "",
  "duration": "",
  "timestamp": 0
}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: JSON.stringify(safeRaw) },
    ],
  });

  const rawText = response.choices[0].message.content.trim();

  // 🔒 Extract JSON safely
  const jsonStart = rawText.indexOf("{");
  const jsonEnd = rawText.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    console.error("LLM OUTPUT:", rawText);
    throw new Error("No JSON found in LLM response");
  }

  const jsonOnly = rawText.slice(jsonStart, jsonEnd + 1);
  const formatted = JSON.parse(jsonOnly);

  // ✅ Override timestamp with current time
  formatted.timestamp = Date.now();

  return formatted;
}

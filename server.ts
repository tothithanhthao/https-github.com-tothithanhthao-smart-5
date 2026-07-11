import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client on server
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  // API Route for checking student writing using Gemini
  app.post("/api/gemini/writing-check", async (req, res) => {
    try {
      const { prompt, text } = req.body;
      if (!ai) {
        // Fallback mock check if API key is not yet set
        return res.json({
          stars: 4,
          correctedText: text || "My favorite subject is English.",
          correctionsList: ["Please set your GEMINI_API_KEY in the Secrets panel to get detailed feedback!"],
          feedback: "Rất tốt! Bạn hãy tiếp tục luyện tập nhé! (Vui lòng thiết lập API Key trong Settings > Secrets để nhận đánh giá chi tiết từ AI).",
          sampleAnswer: "My favorite subject is English because I like reading stories and learning new words."
        });
      }

      const systemPrompt = `You are a supportive, warm, and highly professional elementary school English teacher. 
Evaluate a Vietnamese Grade 5 student's short writing response.
Writing Prompt given to student: "${prompt}"
The student wrote: "${text}"

Provide encouraging feedback in Vietnamese (tiếng Việt), with specific corrected examples in English. Your evaluation should:
1. Praise their effort (use encouraging words suitable for a 10-year-old child).
2. Point out spelling, grammar, punctuation, or vocabulary errors gently and explain them.
3. Rate their overall response (on vocabulary, structure, and completion) on a scale of 1 to 5 stars.
4. Provide a corrected version of their writing.
5. Provide a sample high-quality answer (1-2 simple sentences) that they can study and learn from.

Keep your feedback concise, structured, friendly, and easy to read.

Format your response in a clean JSON with fields:
- stars: number (1 to 5)
- correctedText: string (the fully corrected English text)
- correctionsList: array of strings (mistakes found and explanation in Vietnamese)
- feedback: string (your warm feedback, encouragement, and overall evaluation in Vietnamese)
- sampleAnswer: string (a sample model answer in English)
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: "Evaluate the student writing.",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              stars: { type: "INTEGER" },
              correctedText: { type: "STRING" },
              correctionsList: { type: "ARRAY", items: { type: "STRING" } },
              feedback: { type: "STRING" },
              sampleAnswer: { type: "STRING" }
            },
            required: ["stars", "correctedText", "correctionsList", "feedback", "sampleAnswer"]
          }
        }
      });

      res.json(JSON.parse(response.text?.trim() || "{}"));
    } catch (error: any) {
      console.error("Error evaluating writing:", error);
      res.status(500).json({ error: error.message || "An error occurred during evaluation." });
    }
  });

  // API Route for smart robot buddy (Alfie)
  app.post("/api/gemini/chat-assistant", async (req, res) => {
    try {
      const { message } = req.body;
      if (!ai) {
        return res.json({ reply: "Hi! I'm Alfie. Nice to meet you! (Please configure your GEMINI_API_KEY in Secrets to chat with me)." });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: message || "Hello",
        config: {
          systemInstruction: "You are Alfie, a friendly English-speaking blue alien robot buddy from the Smart Start Grade 5 English textbook. Speak to a Grade 5 Vietnamese student (about 10 years old). Keep your replies extremely simple, super cheerful, and very short (1-2 sentences max). Use grade-appropriate words. Encourage them to learn English. If they speak Vietnamese, answer in simple English first and provide a simple Vietnamese translation in brackets.",
        }
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error("Error in chat assistant:", error);
      res.status(500).json({ error: error.message || "An error occurred." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

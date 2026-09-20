import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config({ override: true });

const app = express();

app.use(cors());

app.use(
  express.json({
    limit: "15mb",
  })
);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.json({
    message: "KrishiRakshak AI server is running",
  });
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { image, language = "English" } = req.body;
    if (!image) {
      return res.status(400).json({
        error: "No image was provided.",
      });
    }

    console.log("");
    console.log("================================");
    console.log("🌱 CROP IMAGE RECEIVED");
    console.log("🤖 GEMINI AI ANALYSIS STARTING");
    console.log("================================");

    // Convert:
    // data:image/jpeg;base64,AAAA...
    // into MIME type + base64 data
    const matches = image.match(/^data:(.+);base64,(.+)$/);

    if (!matches) {
      return res.status(400).json({
        error: "Invalid image format.",
      });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    const prompt = `
The user has selected the language: ${language}

IMPORTANT:
- Return the analysis in ${language}.
- Keep JSON keys in English.
- Translate the crop name, disease, symptoms, severity, recommendations and prevention into ${language}.
- Carefully analyze the actual uploaded crop image.
- Do not randomly select a crop or disease.
- Return ONLY valid JSON.

Use EXACTLY this structure:

{
  "crop": "Detected crop name",
  "disease": "Likely disease or condition",
  "confidence": "90%",
  "severity": "Low",
  "symptoms": [
    "Visible symptom 1",
    "Visible symptom 2",
    "Visible symptom 3"
  ],
  "recommendation": [
    "Recommended action 1",
    "Recommended action 2",
    "Recommended action 3"
  ],
  "prevention": "Prevention advice"
}

IMPORTANT:
- The key must be "crop", NOT "crop_name".
- The key must be "recommendation", NOT "recommendations".
- "symptoms" MUST be an array.
- "recommendation" MUST be an array.
- "prevention" MUST be a string.
- "confidence" MUST be a percentage string.
- "severity" MUST be a short value such as Low, Moderate, or High.
- Do not add extra JSON keys.
- Do not use Markdown.
- Return JSON only.

`;

    const response = await ai.models.generateContent({
       model: "gemini-3.5-flash-lite",
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    console.log("✅ GEMINI ANALYSIS COMPLETED");

    const text = response.text;

    console.log(text);

    let result;

    try {
      result = JSON.parse(text);
    } catch (error) {
      console.error("Gemini returned invalid JSON.");

      return res.status(500).json({
        error: "Gemini returned an invalid response.",
        raw: text,
      });
    }

    res.json(result);
  } catch (error) {
    console.error("");
    console.error("❌ GEMINI AI ERROR");
    console.error(error);

    res.status(500).json({
      error: "AI analysis failed.",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("");
  console.log("================================");
  console.log("🌱 KRISHIRAKSHAK AI SERVER");
  console.log("================================");
  console.log(`Server running on port ${PORT}`);
  console.log("Status: READY");
  console.log("");
});
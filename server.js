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
    const { image } = req.body;

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
You are KrishiRakshak AI, an agricultural crop-health image analysis assistant.

Carefully inspect the ACTUAL uploaded crop image.

Identify:
1. The crop shown.
2. The most likely disease, pest damage, nutrient problem, or healthy condition.
3. Visible symptoms.
4. Severity.
5. Confidence estimate.
6. Practical immediate actions.
7. Prevention advice.

IMPORTANT:
- Analyze the actual image.
- NEVER randomly choose a crop.
- NEVER randomly choose a disease.
- If the crop cannot be identified reliably, say "Unable to identify reliably".
- If the disease cannot be identified reliably, say "Disease not reliably identifiable".
- This is a preliminary visual assessment, not a laboratory diagnosis.
- Do not provide pesticide dosage.
- Recommend confirmation by a local agricultural expert when appropriate.

Return ONLY valid JSON.

Use EXACTLY this structure:

{
  "crop": "Detected crop",
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

app.listen(5000, () => {
  console.log("");
  console.log("================================");
  console.log("🌱 KRISHIRAKSHAK AI SERVER");
  console.log("================================");
  console.log("Server: http://localhost:5000");
  console.log("AI: Gemini 2.5 Flash-Lite");
  console.log("Status: READY");
  console.log("Waiting for crop images...");
  console.log("");
});
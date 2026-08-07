require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generatecourse(title, description) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("CRITICAL: GEMINI_API_KEY environment variable is missing on Render!");
    }

    const prompt = `You are a course generator. Return ONLY valid JSON, no markdown fences, no explanation text before or after.

Generate a structured course based on this input.
Title: "${title}"
Description: "${description}"

JSON schema to follow exactly:
{
  "title": "string",
  "description": "string",
  "modules": [
    {
      "title": "string",
      "lessons": [
        { "title": "string", "content": "string (detailed, 150-300 words)" }
      ]
    }
  ],
"finalTest": [
    { "question": "string", "options": ["string","string","string","string"], "correctAnswer": "string (must exactly match one of the options text, character for character)" }
  ]
}

Rules:
- Generate 4 to 6 modules
- Each module has 3 to 5 lessons
- Content should be genuinely educational and specific to the topic, not generic filler
- The finalTest must have exactly 5 questions covering concepts from across the whole course
- Each finalTest question must have exactly 4 options
- correctAnswer must exactly match one of that question's options, character for character
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    let rawText = response.text;
    console.log("RAW GEMINI RESPONSE:", rawText);

    if (!rawText) {
        throw new Error("Gemini API failed to return content.");
    }

    rawText = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(rawText);
    return parsed;
}

module.exports = generatecourse;
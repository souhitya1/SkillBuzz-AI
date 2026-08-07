require("dotenv").config();

async function generatecourse(title, description) {
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

    // Fixed: Replaced 'gemini-flash-latest' with the correct model endpoint 'gemini-3.5-flash'
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        }
    );

    const data = await response.json();
    console.log("RAW GEMINI RESPONSE:", JSON.stringify(data, null, 2));

    if (!data.candidates || !data.candidates[0].content) {
        throw new Error("Gemini API failed to return content. Check API key permissions and model availability.");
    }

    let rawText = data.candidates[0].content.parts[0].text;
    rawText = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(rawText);
    return parsed;
}

module.exports = generatecourse;
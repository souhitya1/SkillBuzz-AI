require("dotenv").config();
async function generatecourse(title,description){
    const prompt= `You are a course generator. Return ONLY valid JSON, no markdown fences, no explanation text before or after.

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
  ]
}

Rules:
- Generate 4 to 6 modules
- Each module has 3 to 5 lessons
- Content should be genuinely educational and specific to the topic, not generic filler
`
const response = await fetch(
 `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
     contents: [{ parts: [{ text: prompt }] }]
    })
  }
)
const data = await response.json();
  console.log("RAW GEMINI RESPONSE:", JSON.stringify(data, null, 2));
let rawText = data.candidates[0].content.parts[0].text;
rawText = rawText.replace(/```json|```/g, "").trim();
const parsed = JSON.parse(rawText);
return parsed;
}
module.exports = generatecourse;


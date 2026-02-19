import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, ExtractedEntities } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || '' });

// Schema for structured entity extraction and response
const chatResponseSchema = {
  type: Type.OBJECT,
  properties: {
    answer: {
      type: Type.STRING,
      description: "The natural language answer to the user's question based on the calendar.",
    },
    entities: {
      type: Type.OBJECT,
      description: "Entities extracted specifically from the user's latest question.",
      properties: {
        dates: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Specific dates or date ranges mentioned or implied (e.g., 'tomorrow', 'May 5th').",
        },
        semesters: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Semester numbers or identifiers (e.g., 'Sem 5', 'Semester 2').",
        },
        courses: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Course codes or subjects mentioned (e.g., 'CS', 'Math', 'CA1').",
        },
        events: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Event types (e.g., 'exam', 'holiday', 'submission').",
        },
      },
    },
  },
  required: ["answer", "entities"],
};

export const generateCalendarResponse = async (
  imageBase64: string,
  history: ChatMessage[],
  currentQuestion: string
): Promise<{ text: string; entities: ExtractedEntities }> => {
  if (!API_KEY) throw new Error("API Key not found");

  const model = "gemini-3-flash-preview";

  // Construct the prompt with history
  // We send the image + system instruction + chat history as context
  const parts: any[] = [];

  // 1. Add the image context (simulate persistent context by adding it to every request or relying on caching, 
  // but for simple stateless REST calls, sending it once with the prompt is safest for this demo)
  parts.push({
    inlineData: {
      mimeType: "image/png", // Assuming PNG for simplicity, could be derived
      data: imageBase64,
    },
  });

  // 2. Add history context (simplified text representation)
  const historyContext = history
    .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
    .join("\n");

  const prompt = `
    You are an intelligent academic calendar assistant.
    The user has provided an academic calendar image.
    
    Current Chat History:
    ${historyContext}
    
    User's New Question: "${currentQuestion}"
    
    Task:
    1. Analyze the user's question to extract specific entities: Dates, Semesters (e.g., "sem 5", "4th semester"), Course codes or specific Exam names (e.g., "CS", "CA1", "MSE"), and Event types.
    2. Look at the provided calendar image to find the answer.
    3. If the user mentions a semester not explicitly visible (like 'Sem 5'), assume the calendar might imply patterns or explicitly state if it's for Even/Odd semesters. The specific calendar provided is for "Even Semester 2, 4, 6, 8th Sem". If the user asks about Sem 5 (Odd), inform them politely that this calendar is for Even semesters, or infer if the question is general.
    4. Provide a helpful, natural language answer.
    
    Return your response in JSON format matching the schema.
  `;

  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: chatResponseSchema,
        systemInstruction: "You are a helpful academic assistant. Always be precise with dates.",
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");

    const parsed = JSON.parse(jsonText);
    
    return {
      text: parsed.answer,
      entities: parsed.entities || { dates: [], semesters: [], courses: [], events: [] },
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to process your request. Please try again.");
  }
};

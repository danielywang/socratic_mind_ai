import { GoogleGenAI, Content } from "@google/genai";
import { Message } from "../types";

const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = `
You are a Socratic Tutor and Educational Evaluator.
Your goal is to help the user learn by evaluating their current understanding and guiding them deeper.

The user will provide two inputs:
1. A Topic or Question they are exploring.
2. Their current Perspective ("The way I see it is...").

Your response MUST follow this exact structure using Markdown Headers:

### Evaluation
Acknowledge the user's perspective. Evaluate it for accuracy, logic, and nuance. Point out what they got right and where there might be misconceptions. Be constructive and encouraging.

### Elaboration
Provide a structured explanation or deeper insight into the topic, addressing the gaps identified in the evaluation. Get at the crux (the one thing that most people don't intuitively get) behind this discussion.

### The Socratic Turn
*End your response with a single, thought-provoking question that targets the crux of the discussion to advance the user's understanding.*

STRICT FORMATTING RULES:
1. Use "### " (Markdown H3) for the section titles: **Evaluation**, **Elaboration**, and **The Socratic Turn**.
2. **Double Newline**: Ensure there is a full blank line (two newlines) before each header (especially "Elaboration" and "The Socratic Turn").
3. The content of the question in "The Socratic Turn" MUST be italicized.

Tone: Unbiased, educational, encouraging, and intellectual.
`;

export const generateResponse = async (
  currentHistory: Message[],
  topic: string,
  perspective: string
): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key is missing.");
  }

  // Convert history to API format
  // We filter out only previous valid turns to maintain context
  const historyContents: Content[] = currentHistory.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));

  // Construct the new user message
  const userPrompt = `
TOPIC/QUESTION: ${topic}

USER'S CURRENT PERSPECTIVE (The way I see it is...):
${perspective}
`;

  try {
    const model = 'gemini-3-flash-preview';
    
    // We use a chat session to maintain history easily, or just generateContent with history in 'contents'
    // Since we are managing state in React, we will construct the full prompt chain here for stateless request
    // or use the chat helper. Let's use chat helper for simplicity in context management.
    
    const chat = ai.chats.create({
        model: model,
        history: historyContents,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7, // Balance between creativity and accuracy
        }
    });

    const result = await chat.sendMessage({
        message: userPrompt
    });

    return result.text || "I apologize, but I couldn't generate a response at this time.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
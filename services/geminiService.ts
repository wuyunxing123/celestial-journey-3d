
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getCosmicFact = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a short, fascinating, and scientific fact about ${topic} in the context of our solar system. Keep it under 3 sentences.`,
      config: {
        temperature: 0.8,
        topP: 0.95,
      },
    });
    return response.text || "The cosmos is vast and full of mysteries yet to be discovered.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The stars are currently silent. Please try again later.";
  }
};

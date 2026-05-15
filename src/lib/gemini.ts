/**
 * Centralised Gemini client.
 * Import `gemini` wherever you need to call the Gemini API — avoids
 * re-instantiating the client on every request and keeps the key-check in one place.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

function createClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  return new GoogleGenerativeAI(apiKey);
}

// Lazily initialised singleton — safe for serverless (each cold start gets a fresh instance)
let _client: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!_client) _client = createClient();
  return _client;
}

export const GEMINI_IMAGE_MODEL = "gemini-2.5-flash-image";

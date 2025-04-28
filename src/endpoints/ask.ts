import { OpenAPIRoute } from "chanfana";
import { string, z } from "zod";
import { GoogleGenAI } from "@google/genai";

import type { AppContext } from "../types";
import { env } from "hono/adapter";

export class Ask extends OpenAPIRoute {
  method = "get";

  schema = {
    tags: ["Gemini"],
    summary: "Send a request to Gemini",
    request: {
      query: z.object({
        q: string({
          description: "Question",
        }),
      }),
    },
    responses: {
      "200": {
        description: "Returns output from the LLM",
        content: {
          "application/text": {
            schema: string(),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const { GEMINI_API_KEY } = env(c);

    const ai = new GoogleGenAI({
      apiKey: GEMINI_API_KEY as string,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: (await this.getValidatedData()).query.q,
      config: {
        systemInstruction: "Do not use markdown, do not use bold letters",
      },
    });

    return new Response(response.text);
  }
}

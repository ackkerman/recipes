import OpenAI from "openai";
import * as dotenv from "dotenv";

dotenv.config();

const client = new OpenAI(
    {
      apiKey: process.env.OPENAI_API_KEY,
    }
);


export async function generateMarkdown(prompt: string): Promise<string> {
  const res = await client.responses.create({
    model: "gpt-4o",
    input: prompt,
  });

  return res.output_text || "";
}

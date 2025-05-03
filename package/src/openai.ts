import OpenAI from "openai";
import * as dotenv from "dotenv";

dotenv.config();

const client = new OpenAI(
    {
      apiKey: process.env.OPENAI_API_KEY,
    }
);


export async function generateMarkdown(prompt: string, imageUrl?: string): Promise<string> {
  // @ts-ignore
  const res = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          // @ts-ignore
          imageUrl && {
            type: 'image_url',
            image_url: {
              url: imageUrl
            }
          }
        ]
      },
    ],
  });

  return res.choices[0].message.content || "";
}



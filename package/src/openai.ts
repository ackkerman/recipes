import OpenAI from "openai";
import * as dotenv from "dotenv";

dotenv.config();

const client = new OpenAI(
    {
      apiKey: process.env.OPENAI_API_KEY,
    }
);


export async function generateMarkdown(prompt: string, imageUrl?: string): Promise<string> {
  const message_contents = [
    { type: "text", text: prompt },
  ]
  if (imageUrl) {
    message_contents.push({
      type: 'image_url',
      // @ts-ignore
      image_url: {
        url: imageUrl
      }
    })
  }
  
  const res = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: JSON.stringify(message_contents),
      },
    ],
  });

  return res.choices[0].message.content || "";
}



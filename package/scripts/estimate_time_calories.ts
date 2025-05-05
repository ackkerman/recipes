#!/usr/bin/env tsx

// This script estimates and appends the time and calories to a recipe file's frontmatter.
// Usage:
//  npx tsx package/scripts/estimate_time_calories.ts ./docs/recipes/<RECIPE_NAME>.md --output_file=./docs/recipes/<RECIPE_NAME>.md

import { Command } from 'commander';
import OpenAIApi from 'openai';
import * as dotenv from 'dotenv';
import * as fs from 'fs/promises';
import * as path from 'path';
import matter from 'gray-matter';

// .env読み込み
dotenv.config();

const client = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY,
});


// 時間とカロリーを推定する関数
async function estimateTimeAndCalories(recipeText: string): Promise<{ time: number; calories: number }> {
  const prompt = `
以下のレシピ本文から、調理時間(分単位)とカロリー(kcal単位)を推定してください。
必ず次のJSON形式で返答してください。

{
  "time": (調理時間: 数値),
  "calories": (カロリー: 数値)
}

レシピ本文:
${recipeText}
`;


  const res = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });

  const text = res.choices[0].message.content || "";

  try {
    const parsed = JSON.parse(text);
    if (typeof parsed.time !== "number" || typeof parsed.calories !== "number") {
      throw new Error("推定結果が不正です");
    }
    return parsed;
  } catch (err) {
    console.error("OpenAI応答をJSONパースできません:", text);
    throw err;
  }
}

async function main() {
  const program = new Command();
  program
    .name('estimate_time_calories')
    .version('1.0.0')
    .description('レシピMarkdownファイルの時間とカロリーを推定して追記します')
    .argument('<input_file>', 'Input Markdown file')
    .option('--output_file <path>', 'Output Markdown file', "recipe.md")
    .action(async (input_file: string, options: { output_file: string }) => {
        const raw = await fs.readFile(input_file, 'utf-8');
        const parsed = matter(raw);
        if (parsed.data === undefined) {
          console.error(`エラー: フロントマターが見つかりません (${input_file})`);
          process.exit(1);
        } else {
          console.log(`フロントマターを読み込みました: ${JSON.stringify(parsed.data, null, 2)}`);
        }

        if (parsed.data.time !== undefined || parsed.data.calories !== undefined) {
          console.warn(`警告: 既にtimeまたはcaloriesが存在します (${input_file})。スキップします。`);
          process.exit(0);
        }

        console.log(`推定開始: ${input_file} ...`);

        const result = await estimateTimeAndCalories(parsed.content);

        parsed.data.time = result.time;
        parsed.data.calories = result.calories;

        const output = matter.stringify(parsed.content, parsed.data);
        await fs.writeFile(options.output_file, output, 'utf-8');

        console.log(`完了: time=${result.time}分, calories=${result.calories}kcal を追記しました`);
  });
  program.parse(process.argv);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
import { Command } from "commander";
import { scrapeTextFromPage } from "./scraper";
import { formatWithTemplate } from "./formatter";
import { generateMarkdown } from "./openai";
import * as fs from "fs";

const program = new Command();

function isImageUrl(url: string): boolean {
  try {
    const u = new URL(url);

    // パスに拡張子が含まれるか判定
    if (/\.(png|jpe?g|webp|gif)$/i.test(u.pathname)) {
      return true;
    }

    // クエリパラメータに format=xxx が含まれているか判定
    const format = u.searchParams.get('format');
    if (format && /^(png|jpe?g|webp|gif)$/i.test(format)) {
      return true;
    }

    return false;
  } catch (e) {
    console.error(`Invalid URL: ${url}`);
    return false;
  }
}

program
  .name("create-recipe")
  .description("Scrape recipe page or image and generate markdown file")
  .argument("<url>", "URL of recipe page or image")
  .option("-o, --output <filename>", "Output filename", "recipe.md")
  .action(async (url, options) => {
    let promptText: string;
    if (isImageUrl(url)) {
      promptText = `料理画像からレシピを読み取り、Markdownテンプレートに沿って出力してください。`;
    } else {
      const rawText = await scrapeTextFromPage(url);
      promptText = formatWithTemplate(rawText);
    }

    const markdown = await generateMarkdown(promptText, isImageUrl(url) ? url : undefined);
    fs.writeFileSync(options.output, markdown, "utf-8");
    console.log(`✅ Recipe generated: ${options.output}`);
  });

program.parse();


#!/usr/bin/env node
import { Command } from "commander";
import { scrapeTextFromPage } from "./scraper";
import { formatWithTemplate } from "./formatter";
import { generateMarkdown } from "./openai";
import * as fs from "fs";
import * as path from "path";

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
  .option("--output_dir <dirname>", "Output directory", ".")
  .action(async (url, options) => {
    let promptText: string;
    if (isImageUrl(url)) {
      promptText = `料理画像からレシピを読み取り、Markdownテンプレートに沿って出力してください。`;
    } else {
      const rawText = await scrapeTextFromPage(url);
      console.log(`✅ Scraped text: ${rawText.length} characters`);
      promptText = formatWithTemplate(rawText);
    }

    const markdown = await generateMarkdown(promptText, isImageUrl(url) ? url : null)
      .then((markdown) => {
        // ```markdown ... ``` の囲みを除去
        const codeBlockRegex = /```markdown\n([\s\S]*?)\n```/;
        const match = markdown.match(codeBlockRegex);
        return match ? match[1] : markdown;
      });

    // output_dirとoutputを絶対パスにする
    const outputDir = path.resolve(process.cwd(), options.output_dir);
    let outputFilename = options.output;

    if (outputFilename === "recipe.md") {
      // markdownのfrontmatterからtitleを取得
      const frontmatter = markdown.match(/---\n([\s\S]*?)\n---/);
      if (frontmatter) {
        const titleMatch = frontmatter[1].match(/title:\s*(.*)/);
        if (titleMatch) {
          const sanitizedTitle = titleMatch[1].trim().replace(/[\/\\:*?"<>|]/g, '_'); // ファイル名に使えない文字を置換
          outputFilename = sanitizedTitle + ".md";
        }
      }
    }

    const outputFilePath = path.join(outputDir, outputFilename);

    // 出力ディレクトリが存在しない場合は作成
    await fs.promises.mkdir(path.dirname(outputFilePath), { recursive: true });

    fs.writeFileSync(outputFilePath, markdown, "utf-8");
    console.log(`✅ Recipe generated: ${outputFilePath}`);
  });

program.parse();


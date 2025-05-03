import { Command } from "commander";
import { scrapeTextFromPage } from "./scraper";
import { formatWithTemplate } from "./formatter";
import { generateMarkdown } from "./openai";
import * as fs from "fs";

const program = new Command();

program
  .name("create-recipe")
  .description("Scrape recipe page and generate markdown file")
  .argument("<url>", "URL of recipe page")
  .option("-o, --output <filename>", "Output filename", "recipe.md")
  .action(async (url, options) => {
    const rawText = await scrapeTextFromPage(url);
    const promptText = formatWithTemplate(rawText);
    const markdown = await generateMarkdown(promptText);

    fs.writeFileSync(options.output, markdown, "utf-8");
    console.log(`✅ Recipe generated: ${options.output}`);
  });

program.parse();

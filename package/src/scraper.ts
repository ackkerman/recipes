import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeTextFromPage(url: string): Promise<string> {
  const res = await axios.get(url);
  const $ = cheerio.load(res.data);

  // 超単純に本文テキストだけ抽出
  const text = $("body").text();
  return text.replace(/\s+/g, " ").trim();
}

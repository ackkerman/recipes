from typing import Any
from random import choice
import json
from pathlib import Path
from mcp.server.fastmcp import FastMCP

# サーバーインスタンス
mcp = FastMCP("menu")

# レシピデータ読み込み
RECIPES = json.loads(Path("recipes.json").read_text(encoding="utf-8"))
print(f"Loaded {len(RECIPES)} recipes")

@mcp.tool()
async def get_recipe_by_tag(tag: str) -> dict[str, Any]:
    """指定したタグにマッチするレシピをランダムで1件返す"""
    candidates = [r for r in RECIPES if tag in r["tags"]]
    if not candidates:
        return {"error": f"Tag '{tag}' に該当するレシピがありません"}
    return choice(candidates)

@mcp.tool()
async def suggest_today_menu() -> list[dict[str, Any]]:
    """今日の献立（主菜、副菜、汁物）を提案する"""
    menu = []
    for category in ["主菜", "副菜", "汁物"]:
        candidates = [r for r in RECIPES if category in r["tags"]]
        if candidates:
            menu.append(choice(candidates))
    return menu

@mcp.tool()
async def list_tags() -> list[str]:
    """登録されている全タグをアルファベット順に返す"""
    tag_set = set()
    for r in RECIPES:
        tag_set.update(r["tags"])
    return sorted(tag_set)

@mcp.tool()
async def get_recipes_by_conditions(max_time: int = 30, max_calories: int = 500) -> list[dict[str, Any]]:
    """調理時間・カロリー上限を指定してレシピを取得"""
    filtered = [
        r for r in RECIPES
        if r.get("time", 999) <= max_time and r.get("calories", 9999) <= max_calories
    ]
    return filtered
  
if __name__ == "__main__":
    mcp.run(transport="stdio")

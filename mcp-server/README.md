# Menu Server (MCP)

今日の献立を考えてくれる MCP サーバーです。

## セットアップ

```bash
# レシピ接続
ln ../docs/.vitepress/recipes.json  recipes.json

# サーバー起動
uv run server.py
```

## 設定ファイル

```json
{
  "mcpServers": {
    "menu": {
      "command": "uv",
      "args": [
        "--directory",
        "/ABSOLUTE/PATH/TO/YOUR/PROJECT",
        "run",
        "server.py"
      ]
    }
  }
}
```
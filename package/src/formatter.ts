export function formatWithTemplate(rawText: string): string {
  return `
あなたはプロのレシピ編集者です。
以下の生データを、次のTemplateに忠実にMarkdown整形してください。

[Template]
---
title: 料理名
servings: 2
source: <URL>
tags: [時短レシピ]
image: path/to/image.jpg
---

# 🍳 料理名

## 📝 備考
...

## 🛒 材料（〇人前）
| 材料 | 分量 | 備考 |
|:---|:---|:---|
| ... | ... | ... |

## 🥣 手順
...

## 💡 メモ・コツ
...

[元データ]
${rawText}
  `.trim();
}

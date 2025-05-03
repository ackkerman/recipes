import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

// docs/recipes フォルダを読む関数
function getRecipeSidebar() {
  const recipesDir = path.resolve(__dirname, '../recipes')
  const files = fs.readdirSync(recipesDir)

  return files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const name = file.replace(/\.md$/, '')
      return {
        text: name,
        link: `/recipes/${name}`
      }
    })
}

export default defineConfig({
  title: 'レシピコレクション',
  description: 'レシピ一覧',
  themeConfig: {
    sidebar: [
      {
        text: 'レシピ一覧',
        items: getRecipeSidebar()
      }
    ]
  }
})

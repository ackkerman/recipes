import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const recipesDir = path.resolve(__dirname, '../recipes')

export function getRecipeList() {
  const files = fs.readdirSync(recipesDir)

  return files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const fullPath = path.join(recipesDir, file)
      const content = fs.readFileSync(fullPath, 'utf-8')
      const { data } = matter(content)

      const name = file.replace(/\.md$/, '')
      return {
        title: data.title || name,
        link: `/recipes/${name}`,
        image: data.image || '',
        tags: data.tags || [],
        servings: data.servings || 1,
        source: data.source || '',
      }
    })
}

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

(async () => {
  const recipes = getRecipeList()
  fs.writeFileSync(
    path.resolve(__dirname, 'recipes.json'),
    JSON.stringify(recipes, null, 2),
    'utf-8'
  )
  console.log('✅ recipes.json generated!')
})();


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

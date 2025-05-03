import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'レシピコレクション',
  description: '自作レシピ集',
  themeConfig: {
    sidebar: [
      {
        text: 'レシピ一覧',
        items: [
          { text: 'クッキーシューのクッキー生地', link: '/recipes/クッキーシューのクッキー生地' },
          { text: 'チーズ肉巻きおにぎり', link: '/recipes/チーズ肉巻きおにぎり' },
          // 以下同様に追加
        ]
      }
    ]
  }
})

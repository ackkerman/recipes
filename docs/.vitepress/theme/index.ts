import DefaultTheme from 'vitepress/theme'
import { Theme } from 'vitepress'

// @ts-ignore
import RecipeGallery from './components/RecipeGallery.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('RecipeGallery', RecipeGallery)
  }
} satisfies Theme
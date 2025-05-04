import DefaultTheme from 'vitepress/theme'
import { Theme } from 'vitepress'

import VueFeather from 'vue-feather';
// @ts-ignore
import RecipeGallery from './components/RecipeGallery.vue'
// @ts-ignore
import Layout from './Layout.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('VueFeather', VueFeather)
    app.component('RecipeGallery', RecipeGallery)
  }
} satisfies Theme
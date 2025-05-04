<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'

const { Layout } = DefaultTheme
const { frontmatter } = useData()

// クリック時にトップへリダイレクト
const goToTag = (tag: string) => {
  const url = `/?tag=${encodeURIComponent(tag)}`
  if (typeof window !== 'undefined') {
    window.location.href = url
  }
}
</script>

<template>
  <Layout>
    <template #doc-top>
      <div class="recipe-header">
        <img
          v-if="frontmatter.image"
          :src="frontmatter.image  || '/default-food.jpg'"
          alt="Recipe Header Image"
          class="recipe-header-image"
        />
      </div>
    </template>
    <template #doc-before>
      <div class="recipe-tags" v-if="frontmatter.tags">
        <span
          v-for="tag in frontmatter.tags"
          :key="tag"
          class="tag"
          @click="goToTag(tag)"
        >
          {{ tag }}
        </span>
      </div>
    </template>
    <template #doc-footer-before>
      <div v-if="frontmatter.source" class="recipe-source-button">
        <a
          :href="frontmatter.source"
          target="_blank"
          rel="noopener noreferrer"
          class="source-link"
        >
          レシピ元を見る
        </a>
      </div>
    </template>
  </Layout>
</template>

<style scoped>
.recipe-header-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}
.recipe-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
}
.tag {
  background-color: var(--vp-c-brand-1);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
}
.tag:hover {
  background-color: var(--vp-c-brand-2);
  cursor: pointer;
}

.recipe-source-button {
  margin: 1rem 0 2rem;
  text-align: center;
}

.source-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.5rem;
  background-color: var(--vp-c-brand-1);
  color: white;
  border-radius: 9999px;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.3s;
}

.source-link:hover {
  background-color: var(--vp-c-brand-2);
}
</style>

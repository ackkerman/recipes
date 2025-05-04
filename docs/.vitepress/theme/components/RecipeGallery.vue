<template>
  <div class="filter-container">
    <div
      class="filter-bar"
      :class="{ collapsed: !isExpanded }"
    >
      <button
        :class="{ active: selectedTag === null }"
        @click="selectTag(null)"
      >全て</button>

      <template v-for="(tag, index) in uniqueTags" :key="tag">
        <button
          :class="{ active: selectedTag === tag }"
          @click="selectTag(tag)"
        >{{ tag }}</button>
      </template>
    </div>

    <div
      class="fade-overlay"
      @click="toggleExpanded"
      v-show="!isExpanded"
    >
      <span>{{  '＋ 続きを読む' }}</span>
    </div>

  </div>

  <div
    class="close-button"
    @click="toggleExpanded"
    v-show="isExpanded"
  >
    <span>{{  '✕ 閉じる' }}</span>
  </div>


  <div class="recipe-gallery">
    <a
      v-for="recipe in filteredRecipes"
      :key="recipe.link"
      :href="recipe.link"
      class="recipe-card"
    >
      <img
        :src="recipe.image || '/default-no-image.png'"
        alt=""
        class="recipe-image"
      />
      <h3>{{ recipe.title }}</h3>
    </a>
  </div>

</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import recipesRaw from '../../recipes.json'

// タグ管理
const selectedTag = ref<string | null>(null)
const isExpanded = ref(false)

const urlParams = new URLSearchParams(window.location.search)
const initialTag = urlParams.get('tag')
if (initialTag) {
  selectedTag.value = decodeURIComponent(initialTag)
}

// タグ選択時にURLを更新
const selectTag = (tag: string | null) => {
  selectedTag.value = tag
  const params = new URLSearchParams(window.location.search)
  if (tag) {
    params.set('tag', tag)
  } else {
    params.delete('tag')
  }
  const newUrl = `${window.location.pathname}?${params.toString()}`
  window.history.replaceState({}, '', newUrl)
}

// 全タグ一覧（ユニーク）
const uniqueTags = computed(() => {
  const tagCount: Record<string, number> = {}

  recipesRaw.forEach(recipe => {
    (recipe.tags || []).forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1
    })
  })

  return Object.keys(tagCount)
    .sort((a, b) => tagCount[b] - tagCount[a])
})

const visibleTags = computed(() => {
  return isExpanded.value ? uniqueTags.value : uniqueTags.value.slice(0, 8)
})


// フィルタリング
const filteredRecipes = computed(() => {
  if (!selectedTag.value) {
    return recipesRaw
  }
  return recipesRaw.filter(recipe => recipe.tags?.includes(selectedTag.value))
})

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped>
.filter-container {
  position: relative;
  margin-bottom: 2rem;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  transition: max-height 0.3s ease;
  overflow: hidden;
}

.filter-bar.collapsed {
  max-height: 8rem; /* ここでタグリストを制限！ */
}

.fade-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4rem;
  background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, var(--vp-c-bg) 80%);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  padding-bottom: 0.5rem;
}

.fade-overlay span {
  background: rgba(255,255,255,0.7);
  border-radius: 9999px;
  padding: 0.3rem 1rem;
  font-size: 0.95rem;
}

.fade-overlay span:hover {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}

.filter-bar button {
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.filter-bar button.active,
.filter-bar button:hover {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}

.close-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1.5rem auto 2rem;
  width: fit-content;
  padding: 0.5rem 1.5rem;
  background: rgba(255, 255, 255, 0.8); /* ちょっと透け感 */
  border: 1px solid var(--vp-c-border);
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.close-button:hover {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}


.recipe-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.recipe-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.recipe-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.recipe-card h3 {
  margin: 0.5rem 0;
  font-size: 1.1rem;
  padding: 0 0.5rem;
  text-align: center;
}
</style>

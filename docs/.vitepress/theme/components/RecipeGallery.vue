<template>
  <div class="recipe-gallery">
    <a
      v-for="recipe in recipes"
      :key="recipe.link"
      :href="recipe.link"
      class="recipe-card"
    >
      <img v-if="recipe.image" :src="recipe.image" alt="" class="recipe-image" />
      <h3>{{ recipe.title }}</h3>
    </a>
  </div>
</template>

<script setup lang="ts">
import recipes from '../../recipes.json'
console.log(recipes)
</script>

<style scoped>
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

.recipe-gallery a:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.recipe-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.recipe-gallery a h3 {
  margin: 0.5rem 0 0;
  font-size: 1.1rem;
}
</style>

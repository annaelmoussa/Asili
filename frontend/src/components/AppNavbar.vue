<template>
  <nav class="navbar">
    <a
      v-for="category in categories"
      :key="category"
      href="#"
      @click.prevent="goToCategory(category)"
    >
      {{ $t(`app.navbar.${decapitalize(category)}`) }}
    </a>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const categories = ref(['Proteins', 'Snacks', 'Clothing', 'Creatines', 'Vitamins', 'Vegan'])

function decapitalize(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

function goToCategory(category: string) {
  router.push({
    name: 'search',
    query: { category: category }
  })
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.navbar a {
  margin: 0 10px;
  color: #333;
  text-decoration: none;
  padding: 10px;
  border-radius: 5px;
  transition:
    background-color 0.3s,
    color 0.3s;
  cursor: pointer;
}

.navbar a:hover {
  font-weight: bold;
}
</style>

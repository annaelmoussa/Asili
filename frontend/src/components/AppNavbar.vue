<template>
  <nav class="navbar">
    <a
        v-for="(label, key) in categories"
        :key="key"
        href="#"
        @click.prevent="goToCategory(label)"
    >
      {{ $t(`app.navbar.${decapitalize(key)}`) }}
    </a>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const cats = {
  "protein": "Protéines",
  "vitamin": "Vitamines",
  "collagen": "Collagène",
  "mineral": "Minéraux",
  "creatine": "Créatines",
  "aminoAcid": "Acides Aminés"
}
const categories = ref(cats)

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

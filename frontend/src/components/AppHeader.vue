<template>
  <header class="header">
    <a class="logo" href="#" @click="goToHomeView()">{{ $t('app.title') }}</a>
    <div class="search-container">
      <input type="text" :placeholder="$t('app.search')" class="search-input" />
      <button class="search-button">
        <i class="pi pi-search"></i>
      </button>
    </div>
    <div class="header-icons">
      <AccountDropdown />
      <div class="icon-container">
        <i class="pi pi-shopping-cart"></i>
        <span>{{ $t('app.cart') }}</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import AccountDropdown from '@/components/AccountDropdown.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function goToHomeView() {
  router.push({ name: 'home' })
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #10b981;
  padding: 10px 20px;
}

.logo {
  font-size: 1.5em;
  font-weight: bold;
  color: #ffffff;
}

.search-container {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-input {
  border: none;
  padding: 10px;
  font-size: 1em;
  outline: none;
}

.search-button {
  background-color: #ffffff;
  border: none;
  padding: 10px;
  cursor: pointer;
  outline: none;
}

.search-button i {
  color: #10b981;
  font-size: 1.2em;
}

.header-icons {
  display: flex;
  align-items: center;
}

.icon-container {
  display: flex;
  align-items: center;
  margin-left: 20px;
  color: #ffffff;
  cursor: pointer;
}

.icon-container i {
  margin-right: 5px;
  font-size: 1.2em;
}

.icon-container span {
  font-size: 1em;
}
</style>
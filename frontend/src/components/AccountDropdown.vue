<template>
  <div class="account-dropdown" @mouseover="showDropdown = true" @mouseleave="showDropdown = false">
    <CircleUser class="h-5 w-5" />
    <div v-if="showDropdown" class="dropdown-menu">
      <div v-if="!user">
        <Button variant="default" class="w-full mb-2" @click="goToLogin">{{ $t('app.auth.login') }}</Button>
        <Button variant="outline" class="w-full" @click="goToSignup">{{ $t('app.auth.signup') }}</Button>
      </div>
      <div v-else>
        <ul class="menu-list">
          <li v-if="isAdmin" @click="goToDashboard">{{ $t('app.auth.dashboard') }}</li>
          <li v-if="!isAdmin" @click="goToProfile">{{ $t('app.profile.profile') }}</li>
          <li v-if="!isAdmin" @click="goToFavorites">{{ $t('app.auth.favorites') }}</li>
          <li v-if="!isAdmin" @click="goToOrders">{{ $t('app.auth.orders') }}</li>
          <li v-if="!isAdmin" @click="goToReferrals">{{ $t('app.auth.referrals') }}</li>
          <li v-if="!isAdmin" @click="goToMemberBenefits">{{ $t('app.auth.memberBenefits') }}</li>
          <li @click="logout">{{ $t('app.auth.logout') }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import {CircleUser, User} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const showDropdown = ref(false)
const router = useRouter()
const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const isAdmin = computed(() => user.value?.role === 'ROLE_ADMIN')

function goToLogin() {
  router.push('/login')
}

function goToSignup() {
  router.push('/signup')
}

function goToDashboard() {
  if (userStore.isAuthenticated) {
    router.push('/panel')
  } else {
    router.push('/login')
  }
}

function goToProfile() {
  router.push('/profile')
}

function goToFavorites() {
  if (userStore.isAuthenticated) {
    router.push('/favorites')
  } else {
    router.push('/login')
  }
}

function goToOrders() {
  if (userStore.isAuthenticated) {
    router.push('/panel/orders')
  } else {
    router.push('/login')
  }
}

function goToReferrals() {
  if (userStore.isAuthenticated) {
    router.push('/referrals')
  } else {
    router.push('/login')
  }
}

function goToMemberBenefits() {
  if (userStore.isAuthenticated) {
    router.push('/member-benefits')
  } else {
    router.push('/login')
  }
}

async function logout() {
  await userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.account-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  z-index: 1000;
  min-width: 200px;
  padding: 10px;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-list li {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.menu-list li:hover {
  background-color: #f1f2f6;
}
</style>
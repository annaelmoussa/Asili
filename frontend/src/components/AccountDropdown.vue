<template>
  <div class="account-dropdown" @mouseover="showDropdown = true" @mouseleave="showDropdown = false">
    <div class="account-icon">
      <i class="pi pi-user"></i>
      <span>{{ user ? `Bonjour, ${user.email}` : $t('app.account') }}</span>
    </div>
    <div v-if="showDropdown" class="dropdown-menu">
      <div v-if="!user">
        <button class="login-button" @click="goToLogin">{{ $t('app.auth.login') }}</button>
        <button class="signup-button" @click="goToSignup">{{ $t('app.auth.signup') }}</button>
      </div>
      <div v-else>
        <ul class="menu-list">
          <li v-if="isAdmin" @click="goToDashboard">{{ $t('app.auth.dashboard') }}</li>
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
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const showDropdown = ref(false)
const router = useRouter()
const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const isAdmin = computed(() => user.value?.role === 'ROLE_ADMIN')

watch(
  () => userStore.user,
  (newUser) => {
    if (!newUser) {
      router.push('/login')
    }
  }
)

const goToLogin = () => {
  router.push('/login')
}

const goToSignup = () => {
  router.push('/signup')
}

const goToDashboard = () => {
  if (userStore.isAuthenticated) {
    router.push('/panel')
  } else {
    router.push('/login')
  }
}

const goToFavorites = () => {
  if (userStore.isAuthenticated) {
    router.push('/favorites')
  } else {
    router.push('/login')
  }
}

const goToOrders = () => {
  if (userStore.isAuthenticated) {
    router.push('/orders')
  } else {
    router.push('/login')
  }
}

const goToReferrals = () => {
  if (userStore.isAuthenticated) {
    router.push('/referrals')
  } else {
    router.push('/login')
  }
}

const goToMemberBenefits = () => {
  if (userStore.isAuthenticated) {
    router.push('/member-benefits')
  } else {
    router.push('/login')
  }
}

const logout = async () => {
  await userStore.logout()
}
</script>

<style scoped>
.account-dropdown {
  position: relative;
  display: inline-block;
}

.account-icon {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #ffffff;
}

.account-icon i {
  margin-right: 5px;
  font-size: 1.2em;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  z-index: 1000;
  min-width: 200px;
  padding: 10px;
}

.login-button,
.signup-button {
  display: block;
  width: 100%;
  background-color: #10b981;
  color: #ffffff;
  border: none;
  padding: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  text-align: center;
  border-radius: 5px;
}

.signup-button {
  background-color: #ffffff;
  color: #10b981;
  border: 2px solid #10b981;
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

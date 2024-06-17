<template>
    <LanguageSwitcher />
    <AppHeader />
    <div class="auth-container">
      <div class="auth-form">
        <h2>Modifier mon mot de passe</h2>
        <label for="password">Password</label>
        <input type="password" v-model="password" id="password" placeholder="Password" />
        <label for="confirm_password">Confirm Password</label>
        <input type="password" v-model="confirm_password" id="confirm_password" placeholder="Confirm Password" />
        <button @click="requestReset">Request Password Reset</button>
        <p v-if="message">{{ message }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
    import AppHeader from "@/components/AppHeader.vue";
    import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { useRoute } from 'vue-router'
    import { authApi } from '@/api/config'
    import type { UpdatePasswordRequest } from '@/api'
  const router = useRouter()
  const route = useRoute();
  const password = ref('');
  const confirm_password = ref('');
  const message = ref('');
  const token = route.query.token as string;
 
  
  const requestReset = async () => {
    
    try{
        const changePasswordRequest: UpdatePasswordRequest = {token,password: password.value, confirm_password: confirm_password.value };
        await authApi.resetPassword(changePasswordRequest);
        router.push('/login');
    }catch (error){
        console.error('Change password failed', error);
    }
    
  }
  </script>
  
  <style scoped>
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f1f2f6;
  }
  
  .auth-form {
    background: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 400px;
  }
  
  .auth-form h2 {
    margin-bottom: 20px;
  }
  
  .auth-form label {
    display: block;
    margin-bottom: 10px;
  }
  
  .auth-form input {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  .auth-form button {
    width: 100%;
    padding: 10px;
    background-color: #42b883;
    border: none;
    border-radius: 5px;
    color: white;
    font-size: 16px;
    cursor: pointer;
  }
  
  .auth-form p {
    color: #42b883;
    text-align: center;
  }
  </style>
  
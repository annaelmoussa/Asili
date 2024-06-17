<template>
  <LanguageSwitcher />
  <AppHeader />
  <div class="auth-container">
    <div class="auth-form">
      <h2>Reset Password</h2>
      <label for="email">Email</label>
      <input type="email" v-model="email" id="email" placeholder="Email" />
      <button @click="requestReset">Request Password Reset</button>
      <p v-if="message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import AppHeader from "@/components/AppHeader.vue";
import { authApi } from '@/api/config';
import type { ResetPasswordRequest } from '@/api';

const email = ref('');
const message = ref('');

const requestReset = async () => {
    try {
      const resetRequest: ResetPasswordRequest = { email: email.value};
      const response = await authApi.resetPasswordRequest(resetRequest);
      message.value = response.data.message;
    } catch (error) {
      console.error('Request reset failed:', error);
      message.value = 'An error occurred. Please try again.';
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

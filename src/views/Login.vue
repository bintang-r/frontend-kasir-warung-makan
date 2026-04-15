<template>
  <div class="p-4 max-w-sm mx-auto mt-10">
    <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
    <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" v-model="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2 border" required />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Password</label>
        <input type="password" v-model="password" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2 border" required />
      </div>
      <button type="submit" class="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-hover font-medium">Masuk</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');

const handleLogin = () => {
  // Login logic here
  console.log('Login attempt', email.value);
};
</script>

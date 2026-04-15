<script setup>
import ChatbotWidget from './components/ChatbotWidget.vue'
import CartDrawer from './components/CartDrawer.vue'
</script>

<template>
  <div class="h-screen bg-gray-50 flex flex-col items-center">
    <!-- Main constraint container for mobile-first feel -->
    <div class="w-full max-w-md bg-white min-h-screen shadow-md relative pb-20 overflow-x-hidden">
      <router-view />
      
      <CartDrawer />
      <ChatbotWidget />
    </div>
  </div>
</template>

<style scoped>
</style>

<style scoped>
</style>

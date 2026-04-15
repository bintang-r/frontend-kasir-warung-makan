<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from './stores/cart'
import { useNotificationStore } from './stores/notification'
import ChatbotWidget from './components/ChatbotWidget.vue'
import CartDrawer from './components/CartDrawer.vue'
import NotificationDrawer from './components/NotificationDrawer.vue'
import BottomNav from './components/BottomNav.vue'
import TopBar from './components/TopBar.vue'

const cartStore = useCartStore()
const notificationStore = useNotificationStore()
const route = useRoute()

const hideHeader = computed(() => ['Login', 'Register', 'StaffDashboard'].includes(route.name))

onMounted(() => {
  cartStore.fetchCart()
  notificationStore.fetchNotifications()
  
  // Poll for notifications every 30s
  setInterval(() => {
    notificationStore.fetchNotifications()
  }, 30000)
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center overflow-x-hidden">
    <!-- Main constraint container for mobile-first feel -->
    <div class="w-full max-w-md bg-white min-h-screen shadow-premium relative flex flex-col">
      <TopBar v-if="!hideHeader" />
      
      <div class="flex-1 relative scrollbar-hide">
        <router-view v-slot="{ Component }">
          <transition 
            name="fade" 
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
      
      <BottomNav />
      <CartDrawer />
      <NotificationDrawer />
      <ChatbotWidget />
    </div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Hide scrollbar global utility */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>

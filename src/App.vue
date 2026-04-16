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

// Staff routes are anything starting with /staff
const isStaffRoute = computed(() => route.path.startsWith('/staff'))

const hideCustomerUI = computed(() => {
  // Hide customer-specific UI (TopBar, BottomNav, etc) on staff routes or specific pages
  return isStaffRoute.value || ['Login', 'Register'].includes(route.name)
})

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
  <!-- Main layout container: Centered mobile-first for customers, Full-width for staff -->
  <div class="min-h-screen bg-gray-100 flex flex-col items-center overflow-x-hidden">
    
    <div 
      :class="isStaffRoute ? 'w-full' : 'w-full max-w-md bg-white shadow-premium min-h-screen'"
      class="relative flex flex-col transition-all duration-500"
    >
      <TopBar v-if="!hideCustomerUI" />
      
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
      
      <template v-if="!isStaffRoute">
        <BottomNav v-if="!hideCustomerUI" />
        <CartDrawer />
        <NotificationDrawer />
        <ChatbotWidget />
      </template>
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

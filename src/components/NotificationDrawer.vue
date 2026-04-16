<template>
  <div class="relative">
    <!-- Overlay Backdrop -->
    <transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="store.isDrawerOpen" 
        @click="store.closeDrawer"
        class="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[150]"
      ></div>
    </transition>

    <!-- Bottom Sheet -->
    <transition
      enter-active-class="transition-all duration-500 cubic-bezier(0.32, 0.72, 0, 1)"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition-all duration-400 cubic-bezier(0.32, 0.72, 0, 1)"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div 
        v-if="store.isDrawerOpen" 
        class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white rounded-t-[32px] shadow-2xl z-[160] flex flex-col max-h-[80vh] overflow-hidden border-t-4 border-secondary/10"
      >
        <!-- Pull Handle -->
        <div class="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-2"></div>

        <!-- Header -->
        <div class="px-6 py-4 flex items-center justify-between border-b border-gray-50">
          <div>
            <h2 class="text-xl font-black text-gray-900 leading-none">Notifikasi</h2>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{{ store.unreadCount }} Belum Dibaca</p>
          </div>
          <div class="flex items-center gap-2">
            <button 
               v-if="store.unreadCount > 0"
               @click="store.markAllAsRead"
               class="text-[10px] font-black text-primary uppercase tracking-widest px-3 py-1.5 bg-primary/5 rounded-lg active:scale-95 transition-all"
            >
              Baca Semua
            </button>
            <button 
              @click="store.closeDrawer"
              class="p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 transition-colors"
            >
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
        </div>

        <!-- Notification List -->
        <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-hide">
          <div 
            v-for="notif in store.notifications" 
            :key="notif.id"
            @click="store.markAsRead(notif.id)"
            class="p-4 rounded-2xl transition-all cursor-pointer border border-transparent shadow-sm relative group"
            :class="notif.isRead ? 'bg-white opacity-60' : 'bg-gray-50 border-gray-100 ring-1 ring-primary/5'"
          >
            <!-- Unread Indicator -->
            <div v-if="!notif.isRead" class="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full"></div>

            <div class="flex gap-4">
               <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" 
                    :class="notif.isRead ? 'bg-gray-100 text-gray-400' : 'bg-primary/10 text-primary'">
                   <i class="fa-solid fa-bell text-xl"></i>
               </div>
               <div>
                  <h4 class="font-black text-sm text-gray-900 leading-tight">{{ notif.title }}</h4>
                  <p class="text-xs text-gray-500 mt-1 leading-relaxed">{{ notif.message }}</p>
                  <p class="text-[9px] font-bold text-gray-300 uppercase mt-2">{{ formatDate(notif.createdAt) }}</p>
               </div>
            </div>
          </div>

          <div v-if="store.notifications.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
            <div class="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-200 mb-4 scale-110">
                <i class="fa-solid fa-bell-slash text-5xl"></i>
            </div>
            <p class="font-bold text-gray-800">Belum Ada Notifikasi 📭</p>
            <p class="text-xs text-gray-400 mt-1">Kami akan mengabari Anda di sini.</p>
          </div>
        </div>

        <!-- Safe Area Spacer -->
        <div class="h-safe-area bg-white"></div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { useNotificationStore } from '../stores/notification';

const store = useNotificationStore();

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.h-safe-area {
  height: env(safe-area-inset-bottom, 24px);
}
</style>

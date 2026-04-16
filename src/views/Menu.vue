<template>
  <div class="bg-white min-h-screen pb-32">
    <!-- Header with Search -->
    <div class="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100">
      <div class="px-6 pt-12 pb-4">
        <div class="flex items-center gap-4">
          <button @click="router.push('/')" class="p-2 -ml-2 text-gray-400 hover:text-primary transition-colors">
             <i class="fa-solid fa-arrow-left"></i>
          </button>
          <div class="flex-1 relative">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Cari Rendang, Ayam..." 
              class="w-full bg-gray-100 rounded-2xl py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all border-none"
            />
            <i class="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="flex overflow-x-auto gap-4 mt-6 pb-2 scrollbar-hide">
          <button 
            @click="selectedCategory = null"
            class="flex-shrink-0 px-5 py-2 rounded-xl text-xs font-bold transition-all"
            :class="selectedCategory === null ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
          >
            Semua
          </button>
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            @click="selectedCategory = cat.id"
            class="flex-shrink-0 px-5 py-2 rounded-xl text-xs font-bold transition-all"
            :class="String(selectedCategory) === String(cat.id) ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Menu Content -->
    <div class="p-6">
      <div v-if="isLoading" class="grid grid-cols-2 gap-4">
        <div v-for="n in 6" :key="n" class="aspect-[4/5] bg-gray-100 rounded-2xl animate-pulse"></div>
      </div>

      <div v-else-if="filteredMenus.length > 0" class="grid grid-cols-2 gap-x-4 gap-y-6">
        <MenuCard 
          v-for="menu in filteredMenus" 
          :key="menu.id" 
          :menu="menu" 
          @add-to-cart="handleAddToCart"
        />
      </div>

      <div v-else class="flex flex-col items-center justify-center py-20 text-center">
        <div class="bg-gray-100 p-6 rounded-full text-gray-300 mb-4">
           <i class="fa-solid fa-search text-5xl"></i>
        </div>
        <h3 class="font-bold text-gray-800">Menu tidak ditemukan</h3>
        <p class="text-sm text-gray-400 mt-1">Coba kata kunci lain.</p>
      </div>
    </div>

    <NotificationToast ref="toast" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';
import { useCartStore } from '../stores/cart';
import MenuCard from '../components/MenuCard.vue';
import NotificationToast from '../components/NotificationToast.vue';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const menus = ref([]);
const categories = ref([]);
const isLoading = ref(true);
const toast = ref(null);

const searchQuery = ref('');
const selectedCategory = ref(null);

const fetchAll = async () => {
  try {
    isLoading.value = true;
    const [menuRes, catRes] = await Promise.all([
      api.get('/menus'),
      api.get('/categories')
    ]);
    menus.value = menuRes.data;
    categories.value = catRes.data;
    
    // Check initial query category
    const queryCat = route.query.category;
    if (queryCat) {
      selectedCategory.value = queryCat;
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
    toast.value?.display('Gagal memuat data dari server', 'error');
  } finally {
    isLoading.value = false;
  }
};

const filteredMenus = computed(() => {
  let result = menus.value;
  
  if (selectedCategory.value) {
    // Cast to string for comparison if necessary
    result = result.filter(m => String(m.categoryId) === String(selectedCategory.value));
  }
  
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(m => 
      m.name.toLowerCase().includes(q) || 
      (m.description && m.description.toLowerCase().includes(q))
    );
  }
  
  return result;
});

const handleAddToCart = async (menu) => {
  try {
    await cartStore.addItem(menu.id, 1);
    toast.value?.display(`Ditambahkan ke keranjang`, 'success');
  } catch (error) {
    toast.value?.display('Gagal menambahkan ke keranjang', 'error');
  }
};

onMounted(() => {
  fetchAll();
  cartStore.fetchCart();
});

// Sync category selection with URL
watch(selectedCategory, (newVal) => {
  if (newVal) {
    router.replace({ query: { ...route.query, category: newVal } });
  } else {
    const { category, ...rest } = route.query;
    router.replace({ query: rest });
  }
});
</script>

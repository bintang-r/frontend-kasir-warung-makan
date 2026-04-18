<template>
  <div class="space-y-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Branding Settings -->
      <div class="lg:col-span-1 space-y-8">
        <div class="bg-white p-8 rounded-[40px] border border-gray-100 shadow-premium">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-lg">
              <i class="fa-solid fa-store text-xl"></i>
            </div>
            <div>
              <h3 class="font-black text-gray-900 tracking-tight">Identitas Warung</h3>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama & Branding Visual</p>
            </div>
          </div>

          <form @submit.prevent="saveName" class="space-y-6">
            <div class="space-y-2">
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">Nama Restoran</label>
              <input 
                v-model="restaurantName" 
                type="text" 
                placeholder="Contoh: RM Siantar Minang"
                class="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-3xl font-bold text-gray-900 transition-all outline-none"
              />
            </div>

            <button 
              type="submit" 
              :disabled="savingName"
              class="w-full bg-gray-900 text-white py-4 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:shadow-xl hover:shadow-primary/20 transition-all disabled:opacity-50"
            >
              {{ savingName ? 'Menyimpan...' : 'Perbarui Nama' }}
            </button>
          </form>
        </div>

        <!-- Logo Upload Card -->
        <div class="bg-white p-8 rounded-[40px] border border-gray-100 shadow-premium">
          <h4 class="text-xs font-black text-gray-900 uppercase tracking-widest mb-6">Logo Restoran</h4>
          
          <div class="flex flex-col items-center">
            <!-- Current Logo Preview -->
            <div class="w-48 h-48 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden mb-6 group relative shadow-inner">
               <template v-if="brandingStore.fullLogoUrl">
                  <img :src="brandingStore.fullLogoUrl" class="w-full h-full object-contain p-4" />
               </template>
               <template v-else>
                  <i class="fa-solid fa-image text-gray-300 text-4xl"></i>
               </template>
               
               <div class="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" @click="triggerFileInput">
                  <i class="fa-solid fa-camera text-white text-2xl"></i>
               </div>
            </div>

            <input 
              ref="fileInput"
              type="file" 
              @change="onFileChange"
              accept="image/*"
              class="hidden"
            />

            <p class="text-[9px] font-bold text-gray-400 text-center uppercase tracking-widest leading-relaxed px-4 mb-6">
              Gunakan file PNG atau SVG dengan latar transparan untuk hasil terbaik.
            </p>

            <button 
              @click="triggerFileInput"
              class="w-full py-4 border-2 border-gray-100 hover:border-primary rounded-3xl text-[10px] font-black text-gray-900 uppercase tracking-widest transition-all"
            >
              Pilih File Logo
            </button>
          </div>
        </div>
      </div>

      <!-- Preview Section -->
      <div class="lg:col-span-2 space-y-8">
        <div class="bg-gray-900 p-10 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden">
           <!-- Decor -->
           <div class="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
           
           <div class="relative z-10 flex flex-col md:flex-row gap-12 items-center">
              <div class="w-48 h-48 bg-white/5 backdrop-blur-sm border border-white/10 rounded-[40px] flex items-center justify-center p-8">
                  <template v-if="brandingStore.fullLogoUrl">
                    <img :src="brandingStore.fullLogoUrl" class="w-full h-full object-contain" />
                  </template>
                  <i v-else class="fa-solid fa-store text-white/20 text-6xl"></i>
              </div>
              
              <div class="text-center md:text-left flex-1">
                 <h2 class="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                    {{ restaurantName || 'RM Siantar Minang' }}
                 </h2>
                 <p class="text-primary font-bold mt-4 uppercase tracking-[0.4em] text-xs">Pratinjau Identitas Bisnis</p>
                 <div class="flex gap-4 mt-8 justify-center md:justify-start">
                    <div class="px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
                       <p class="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Status Sistem</p>
                       <p class="text-xs font-bold text-white">Online & Aktif</p>
                    </div>
                    <div class="px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
                       <p class="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Versi</p>
                       <p class="text-xs font-bold text-white">v2.1.0-staff</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <!-- How it looks in Header/Sidebar -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div class="bg-white p-8 rounded-[40px] border border-gray-100 shadow-premium">
              <h5 class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 text-center px-4 py-2 border-b border-gray-50">Tampilan Header</h5>
              <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-3xl">
                  <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center overflow-hidden">
                     <img v-if="brandingStore.fullLogoUrl" :src="brandingStore.fullLogoUrl" class="w-full h-full object-contain" />
                     <i v-else class="fa-solid fa-cloud-sun text-white"></i>
                  </div>
                  <div>
                    <h1 class="font-black text-xs tracking-tight leading-none text-gray-900">STAFF <span class="text-primary">PORTAL</span></h1>
                    <p class="text-[8px] font-bold text-gray-400 uppercase mt-1 tracking-widest">{{ restaurantName }}</p>
                  </div>
              </div>
           </div>

           <div class="bg-white p-8 rounded-[40px] border border-gray-100 shadow-premium">
              <h5 class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 text-center px-4 py-2 border-b border-gray-50">Tampilan Login</h5>
              <div class="bg-gray-900 p-6 rounded-3xl text-center">
                  <img v-if="brandingStore.fullLogoUrl" :src="brandingStore.fullLogoUrl" class="h-10 w-auto mx-auto object-contain mb-4" />
                  <h2 class="text-sm font-black text-white leading-tight">
                    {{ restaurantName }}
                  </h2>
              </div>
           </div>
        </div>
      </div>
    </div>

    <NotificationToast ref="toast" />
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { useBrandingStore } from '../../stores/branding';
import api from '../../services/api';
import NotificationToast from '../../components/NotificationToast.vue';

const brandingStore = useBrandingStore();
const toast = ref(null);
const staffToast = inject('staffToast');

const restaurantName = ref('');
const savingName = ref(false);
const fileInput = ref(null);

onMounted(() => {
  restaurantName.value = brandingStore.restaurantName;
});

const saveName = async () => {
  if (!restaurantName.value) return;
  savingName.value = true;
  try {
    await api.patch('/infrastructure/branding', { name: restaurantName.value });
    brandingStore.restaurantName = restaurantName.value;
    staffToast.value?.show('Nama warung berhasil diperbarui!', 'success');
  } catch (err) {
    staffToast.value?.show('Gagal memperbarui nama warung', 'error');
  } finally {
    savingName.value = false;
  }
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const onFileChange = async (e) => {
  const file = e.target.target?.files?.[0] || e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('logo', file);

  try {
    const res = await api.post('/infrastructure/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    brandingStore.logoUrl = res.data.value;
    staffToast.value?.show('Logo berhasil diperbarui!', 'success');
  } catch (err) {
    staffToast.value?.show('Gagal mengunggah logo', 'error');
  }
};
</script>

<style scoped>
.shadow-premium {
  box-shadow: 0 20px 50px -12px rgba(0,0,0,0.05);
}
</style>

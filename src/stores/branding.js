import { defineStore } from 'pinia';
import api, { getImageUrl } from '../services/api';

export const useBrandingStore = defineStore('branding', {
  state: () => ({
    logoUrl: null,
    restaurantName: 'RM Siantar Minang',
    isLoading: false,
    isLoaded: false
  }),

  getters: {
    fullLogoUrl: (state) => getImageUrl(state.logoUrl)
  },

  actions: {
    async fetchBranding() {
      this.isLoading = true;
      try {
        const res = await api.get('/infrastructure/branding');
        this.logoUrl = res.data.logo;
        this.restaurantName = res.data.name;
        this.isLoaded = true;
      } catch (err) {
        console.error('Failed to fetch branding:', err);
      } finally {
        this.isLoading = false;
      }
    },

    setBranding(name, logo) {
      this.restaurantName = name;
      this.logoUrl = logo;
    }
  }
});

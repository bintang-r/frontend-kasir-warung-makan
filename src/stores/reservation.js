import { defineStore } from 'pinia';

export const useReservationStore = defineStore('reservation', {
  state: () => ({
    isReservationMode: false,
    reservationData: {
      name: '',
      phone: '',
      date: '',
      guestCount: 2,
      tableId: null,
      notes: ''
    },
    cartItems: []
  }),

  getters: {
    totalPrice: (state) => {
      return state.cartItems.reduce((total, item) => total + (item.price * item.qty), 0);
    },
    totalItems: (state) => {
      return state.cartItems.reduce((total, item) => total + item.qty, 0);
    }
  },

  actions: {
    startReservation(data) {
      this.reservationData = { ...data };
      this.isReservationMode = true;
      this.cartItems = [];
    },

    cancelReservation() {
      this.isReservationMode = false;
      this.cartItems = [];
      this.reservationData = {
        name: '',
        phone: '',
        date: '',
        guestCount: 2,
        tableId: null,
        notes: ''
      };
    },

    addItem(menu) {
      const existing = this.cartItems.find(item => item.menuId === menu.id);
      if (existing) {
        existing.qty += 1;
      } else {
        this.cartItems.push({
          menuId: menu.id,
          name: menu.name,
          price: Number(menu.price),
          image: menu.image,
          qty: 1
        });
      }
    },

    removeItem(menuId) {
      const idx = this.cartItems.findIndex(item => item.menuId === menuId);
      if (idx !== -1) {
        if (this.cartItems[idx].qty > 1) {
          this.cartItems[idx].qty -= 1;
        } else {
          this.cartItems.splice(idx, 1);
        }
      }
    },

    getQty(menuId) {
      const item = this.cartItems.find(i => i.menuId === menuId);
      return item ? item.qty : 0;
    }
  },

  persist: true // Use pinia-plugin-persistedstate if available, to keep session on reload
});

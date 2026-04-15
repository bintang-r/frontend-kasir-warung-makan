import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([]);
  const isDrawerOpen = ref(false);

  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.isRead).length;
  });

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      notifications.value = response.data;
    } catch (e) {
      console.error('Error fetching notifications', e);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      const index = notifications.value.findIndex(n => n.id === id);
      if (index !== -1) {
        notifications.value[index].isRead = true;
      }
    } catch (e) {
      console.error('Error marking notification as read', e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/read-all');
      notifications.value.forEach(n => n.isRead = true);
    } catch (e) {
      console.error('Error marking all notifications as read', e);
    }
  };

  const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value;
  };

  const closeDrawer = () => {
    isDrawerOpen.value = false;
  };

  return {
    notifications,
    unreadCount,
    isDrawerOpen,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    toggleDrawer,
    closeDrawer,
  };
});

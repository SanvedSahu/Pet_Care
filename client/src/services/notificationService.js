import api from './api';
import { getStored, setStored, STORAGE_KEYS } from './mockDataStore';

export const getNotifications = async () => {
  try {
    const res = await api.get('/notifications');
    if (res.data && res.data.success) {
      return res.data.data;
    }
  } catch (err) {
    console.warn('Backend unavailable, fetching mock notifications:', err.message);
  }

  const user = JSON.parse(localStorage.getItem('petcare_user') || '{}');
  const all = getStored(STORAGE_KEYS.NOTIFICATIONS, []);
  const userNotifs = all.filter((n) => n.userEmail === user?.email || !n.userEmail);
  const unreadCount = userNotifs.filter((n) => !n.isRead).length;

  return {
    notifications: userNotifs,
    unreadCount,
  };
};

export const markNotificationRead = async (id) => {
  try {
    const res = await api.patch(`/notifications/${id}/read`);
    if (res.data && res.data.success) {
      return res.data.data;
    }
  } catch (err) {
    console.warn('Backend unavailable, marking notification read locally:', err.message);
  }

  const all = getStored(STORAGE_KEYS.NOTIFICATIONS, []);
  const index = all.findIndex((n) => n._id === id);
  if (index !== -1) {
    all[index].isRead = true;
    setStored(STORAGE_KEYS.NOTIFICATIONS, all);
  }
  return true;
};

export const markAllNotificationsRead = async () => {
  try {
    const res = await api.patch('/notifications/read-all');
    if (res.data && res.data.success) {
      return true;
    }
  } catch (err) {
    console.warn('Backend unavailable, marking all read locally:', err.message);
  }

  const all = getStored(STORAGE_KEYS.NOTIFICATIONS, []);
  all.forEach((n) => (n.isRead = true));
  setStored(STORAGE_KEYS.NOTIFICATIONS, all);
  return true;
};

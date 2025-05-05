import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      
      // إضافة إشعار جديد
      addNotification: (notification) => {
        const newNotification = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          read: false,
          ...notification
        };
        
        set(state => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1
        }));
        
        return newNotification;
      },
      
      // تحديد إشعار كمقروء
      markAsRead: (notificationId) => {
        set(state => {
          const updatedNotifications = state.notifications.map(notif => 
            notif.id === notificationId ? { ...notif, read: true } : notif
          );
          
          const unreadCount = updatedNotifications.filter(n => !n.read).length;
          
          return {
            notifications: updatedNotifications,
            unreadCount
          };
        });
      },
      
      // تحديد جميع الإشعارات كمقروءة
      markAllAsRead: () => {
        set(state => ({
          notifications: state.notifications.map(notif => ({ ...notif, read: true })),
          unreadCount: 0
        }));
      },
      
      // حذف إشعار
      deleteNotification: (notificationId) => {
        set(state => {
          const updatedNotifications = state.notifications.filter(
            notif => notif.id !== notificationId
          );
          
          const unreadCount = updatedNotifications.filter(n => !n.read).length;
          
          return {
            notifications: updatedNotifications,
            unreadCount
          };
        });
      },
      
      // حذف جميع الإشعارات
      clearAllNotifications: () => {
        set({ notifications: [], unreadCount: 0 });
      }
    }),
    {
      name: 'jobscope-notifications', // اسم مفتاح التخزين في localStorage
    }
  )
);

export default useNotificationStore;

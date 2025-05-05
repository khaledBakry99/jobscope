import useNotificationStore from '../store/notificationStore';

// أنواع الإشعارات
export const NOTIFICATION_TYPES = {
  BOOKING_CREATED: 'booking_created',
  BOOKING_ACCEPTED: 'booking_accepted',
  BOOKING_REJECTED: 'booking_rejected',
  BOOKING_COMPLETED: 'booking_completed',
  BOOKING_CANCELLED: 'booking_cancelled',
  REVIEW_RECEIVED: 'review_received',
  SYSTEM: 'system'
};

// خدمة الإشعارات
const notificationService = {
  // إنشاء إشعار لطلب جديد
  createBookingNotification: (booking, userType) => {
    const store = useNotificationStore.getState();
    
    // إذا كان المستخدم هو الحرفي، نرسل إشعار بوجود طلب جديد
    if (userType === 'craftsman') {
      return store.addNotification({
        type: NOTIFICATION_TYPES.BOOKING_CREATED,
        title: 'طلب خدمة جديد',
        message: `لديك طلب خدمة جديد من ${booking.clientName}`,
        data: { bookingId: booking.id },
        icon: 'clipboard-list'
      });
    }
    
    // إذا كان المستخدم هو العميل، نرسل إشعار بتأكيد إنشاء الطلب
    return store.addNotification({
      type: NOTIFICATION_TYPES.BOOKING_CREATED,
      title: 'تم إنشاء طلب الخدمة',
      message: `تم إنشاء طلب الخدمة بنجاح مع ${booking.craftsmanName}`,
      data: { bookingId: booking.id },
      icon: 'clipboard-check'
    });
  },
  
  // إنشاء إشعار لتغيير حالة الطلب
  createStatusChangeNotification: (booking, status, userType) => {
    const store = useNotificationStore.getState();
    
    // تجاهل الإشعار إذا كان المستخدم هو من قام بتغيير الحالة
    if ((userType === 'craftsman' && status === 'accepted') ||
        (userType === 'client' && status === 'cancelled')) {
      return null;
    }
    
    let notificationType, title, message, icon;
    
    switch (status) {
      case 'accepted':
        notificationType = NOTIFICATION_TYPES.BOOKING_ACCEPTED;
        title = 'تم قبول طلب الخدمة';
        message = `تم قبول طلب الخدمة من قبل ${booking.craftsmanName}`;
        icon = 'check-circle';
        break;
      case 'rejected':
        notificationType = NOTIFICATION_TYPES.BOOKING_REJECTED;
        title = 'تم رفض طلب الخدمة';
        message = `تم رفض طلب الخدمة من قبل ${booking.craftsmanName}`;
        icon = 'x-circle';
        break;
      case 'completed':
        notificationType = NOTIFICATION_TYPES.BOOKING_COMPLETED;
        title = 'تم إكمال الخدمة';
        message = userType === 'client' 
          ? `تم إكمال الخدمة من قبل ${booking.craftsmanName}` 
          : `تم تأكيد إكمال الخدمة لـ ${booking.clientName}`;
        icon = 'check-square';
        break;
      case 'cancelled':
        notificationType = NOTIFICATION_TYPES.BOOKING_CANCELLED;
        title = 'تم إلغاء طلب الخدمة';
        message = userType === 'craftsman' 
          ? `تم إلغاء طلب الخدمة من قبل ${booking.clientName}` 
          : 'تم إلغاء طلب الخدمة';
        icon = 'x-square';
        break;
      default:
        return null;
    }
    
    return store.addNotification({
      type: notificationType,
      title,
      message,
      data: { bookingId: booking.id },
      icon
    });
  },
  
  // إنشاء إشعار لتقييم جديد
  createReviewNotification: (review, booking) => {
    const store = useNotificationStore.getState();
    
    return store.addNotification({
      type: NOTIFICATION_TYPES.REVIEW_RECEIVED,
      title: 'تقييم جديد',
      message: `تلقيت تقييماً جديداً (${review.rating}/5) من ${booking.clientName}`,
      data: { bookingId: booking.id, reviewId: review.id },
      icon: 'star'
    });
  },
  
  // إنشاء إشعار نظام
  createSystemNotification: (title, message) => {
    const store = useNotificationStore.getState();
    
    return store.addNotification({
      type: NOTIFICATION_TYPES.SYSTEM,
      title,
      message,
      icon: 'bell'
    });
  }
};

export default notificationService;

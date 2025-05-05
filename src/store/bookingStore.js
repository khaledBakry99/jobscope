import { create } from "zustand";
import { persist } from "zustand/middleware";
import useReviewStore from "./reviewStore";
import notificationService from "../services/notificationService";
import useUserStore from "./userStore";

const useBookingStore = create(
  persist(
    (set, get) => ({
      bookings: [
        // Datos de prueba para las reservas
        {
          id: 1,
          craftsmanId: 1,
          craftsmanName: "محمد الخطيب",
          craftsmanPhone: "+963 912 345 678",
          clientId: 2,
          clientName: "أحمد محمد",
          clientPhone: "0923456789",
          date: "2023-06-15",
          time: "14:30",
          description: "تصليح تسرب مياه في المطبخ وتغيير حنفية المغسلة",
          status: "completed",
          createdAt: "2023-06-10T10:30:00.000Z",
          reviewId: 1,
        },
        {
          id: 2,
          craftsmanId: 3,
          craftsmanName: "خالد العلي",
          craftsmanPhone: "+963 934 567 890",
          clientId: 2,
          clientName: "أحمد محمد",
          clientPhone: "0923456789",
          date: "2023-06-20",
          time: "10:00",
          description:
            "تركيب وحدات إنارة في غرفة المعيشة وإصلاح مشكلة في الكهرباء",
          status: "pending",
          createdAt: "2023-06-18T09:15:00.000Z",
        },
        {
          id: 3,
          craftsmanId: 2,
          craftsmanName: "عمر السيد",
          craftsmanPhone: "+963 945 678 901",
          clientId: 2,
          clientName: "أحمد محمد",
          clientPhone: "0923456789",
          date: "2023-06-25",
          time: "16:00",
          description: "صيانة مكيف الهواء وتنظيف الفلاتر",
          status: "completed",
          createdAt: "2023-06-20T11:45:00.000Z",
        },
        {
          id: 4,
          craftsmanId: 1,
          craftsmanName: "محمد الخطيب",
          craftsmanPhone: "+963 912 345 678",
          clientId: 3,
          clientName: "سارة أحمد",
          clientPhone: "0956789012",
          date: "2023-06-18",
          time: "09:30",
          description: "إصلاح تسرب في سخان الماء",
          status: "completed",
          createdAt: "2023-06-15T08:20:00.000Z",
          reviewId: 4,
        },
        {
          id: 5,
          craftsmanId: 2,
          craftsmanName: "عمر السيد",
          craftsmanPhone: "+963 945 678 901",
          clientId: 4,
          clientName: "محمود خالد",
          clientPhone: "0967890123",
          date: "2023-06-22",
          time: "11:00",
          description: "تركيب أرفف خشبية في المكتبة",
          status: "completed",
          createdAt: "2023-06-19T14:10:00.000Z",
          reviewId: 5,
        },
      ],

      // Add a new booking
      addBooking: (booking) => {
        const newBooking = {
          ...booking,
          id: Date.now(), // Simple ID generation
          status: "pending",
          createdAt: new Date().toISOString(),
          canEdit: true, // Permite editar durante los primeros 5 minutos
        };

        set((state) => ({
          bookings: [...state.bookings, newBooking],
        }));

        // إضافة إشعار للحجز الجديد
        const userType = useUserStore.getState().userType;
        notificationService.createBookingNotification(newBooking, userType);

        return newBooking;
      },

      // Update booking status
      updateBookingStatus: (bookingId, status) => {
        let updatedBooking = null;

        set((state) => {
          const updatedBookings = state.bookings.map((booking) => {
            if (booking.id === bookingId) {
              updatedBooking = {
                ...booking,
                status,
                updatedAt: new Date().toISOString(),
              };
              return updatedBooking;
            }
            return booking;
          });

          return { bookings: updatedBookings };
        });

        // إضافة إشعار لتغيير الحالة
        if (updatedBooking) {
          const userType = useUserStore.getState().userType;
          notificationService.createStatusChangeNotification(
            updatedBooking,
            status,
            userType
          );
        }
      },

      // Update booking details
      updateBooking: (bookingId, updatedData) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === bookingId
              ? {
                  ...booking,
                  ...updatedData,
                  updatedAt: new Date().toISOString(),
                }
              : booking
          ),
        }));
      },

      // Check if booking can be edited (within 5 minutes of creation)
      canEditBooking: (bookingId) => {
        const booking = get().getBookingById(bookingId);
        if (!booking) return false;

        const createdAt = new Date(booking.createdAt);
        const now = new Date();
        const diffInMinutes = (now - createdAt) / (1000 * 60);

        return diffInMinutes <= 5;
      },

      // Add review to a booking
      addReview: (bookingId, review) => {
        // Obtener la reserva para acceder a los IDs del artesano y cliente
        const booking = get().getBookingById(bookingId);

        if (!booking) {
          console.error("No se encontró la reserva con ID:", bookingId);
          return null;
        }

        // Verificar si la reserva ya tiene una evaluación
        if (booking.reviewId) {
          console.warn("Esta reserva ya tiene una evaluación");
          return null;
        }

        // Crear una referencia a la evaluación detallada
        const reviewData = {
          bookingId,
          craftsmanId: booking.craftsmanId,
          clientId: booking.clientId,
          overallRating: review.overallRating,
          qualityRating: review.qualityRating,
          punctualityRating: review.punctualityRating,
          priceRating: review.priceRating,
          communicationRating: review.communicationRating,
          comment: review.comment,
          images: review.images || [],
        };

        try {
          // Añadir la evaluación detallada al almacén de evaluaciones
          const detailedReview = useReviewStore
            .getState()
            .addReview(reviewData);
          console.log("Evaluación creada:", detailedReview);

          // Actualizar la reserva con una referencia a la evaluación
          set((state) => ({
            bookings: state.bookings.map((b) =>
              b.id === bookingId
                ? {
                    ...b,
                    reviewId: detailedReview.id,
                    status: "completed",
                  }
                : b
            ),
          }));

          // إضافة إشعار للتقييم الجديد
          notificationService.createReviewNotification(detailedReview, booking);

          return detailedReview;
        } catch (error) {
          console.error("Error al añadir la evaluación:", error);
          return null;
        }
      },

      // Get bookings for a user (ordered by creation date, newest first)
      getUserBookings: (userId, userType) => {
        const { bookings } = get();
        let userBookings = [];

        if (userType === "client") {
          userBookings = bookings.filter(
            (booking) => booking.clientId === userId
          );
        } else if (userType === "craftsman") {
          userBookings = bookings.filter(
            (booking) => booking.craftsmanId === userId
          );
        }

        // Ordenar por fecha de creación (de más reciente a más antigua)
        return userBookings.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      },

      // Get a single booking by ID
      getBookingById: (bookingId) => {
        const { bookings } = get();
        return bookings.find((booking) => booking.id === bookingId);
      },
    }),
    {
      name: "jobscope-booking-storage",
    }
  )
);

export default useBookingStore;

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useReviewStore = create(
  persist(
    (set, get) => ({
      reviews: [
        // بيانات افتراضية للتقييمات
        {
          id: 1,
          bookingId: 1,
          craftsmanId: 1,
          clientId: 1,
          overallRating: 5,
          qualityRating: 5,
          punctualityRating: 4,
          priceRating: 5,
          communicationRating: 5,
          comment:
            "عمل ممتاز وسريع، قام بإصلاح المشكلة في وقت قياسي وبجودة عالية. أنصح بالتعامل معه.",
          images: [
            "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
            "https://images.unsplash.com/photo-1581141849291-1125c7b692b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          ],
          createdAt: "2023-06-15T10:30:00.000Z",
        },
        {
          id: 2,
          bookingId: 2,
          craftsmanId: 1,
          clientId: 2,
          overallRating: 4,
          qualityRating: 4,
          punctualityRating: 3,
          priceRating: 4,
          communicationRating: 5,
          comment: "خدمة جيدة وأسعار معقولة. كان متعاوناً ومحترفاً في التعامل.",
          images: [],
          createdAt: "2023-06-02T14:20:00.000Z",
        },
        {
          id: 3,
          bookingId: 3,
          craftsmanId: 1,
          clientId: 3,
          overallRating: 5,
          qualityRating: 5,
          punctualityRating: 5,
          priceRating: 4,
          communicationRating: 5,
          comment:
            "من أفضل الحرفيين الذين تعاملت معهم. دقيق في العمل ويلتزم بالمواعيد. سأتعامل معه مرة أخرى بالتأكيد.",
          images: [
            "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          ],
          createdAt: "2023-05-20T09:15:00.000Z",
        },
        {
          id: 4,
          bookingId: 4,
          craftsmanId: 2,
          clientId: 1,
          overallRating: 5,
          qualityRating: 5,
          punctualityRating: 5,
          priceRating: 4,
          communicationRating: 5,
          comment:
            "ممتاز جداً، أنجز العمل بسرعة وإتقان. سعره مناسب جداً مقارنة بالجودة.",
          images: [
            "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
          ],
          createdAt: "2023-06-10T11:45:00.000Z",
        },
        {
          id: 5,
          bookingId: 5,
          craftsmanId: 2,
          clientId: 2,
          overallRating: 4,
          qualityRating: 4,
          punctualityRating: 3,
          priceRating: 5,
          communicationRating: 4,
          comment:
            "عمل جيد وسعر ممتاز. تأخر قليلاً عن الموعد لكن الجودة كانت جيدة.",
          images: [],
          createdAt: "2023-05-28T16:30:00.000Z",
        },
        {
          id: 6,
          bookingId: 6,
          craftsmanId: 2,
          clientId: 3,
          overallRating: 5,
          qualityRating: 5,
          punctualityRating: 4,
          priceRating: 5,
          communicationRating: 5,
          comment:
            "خدمة ممتازة وسريعة. قام بإصلاح المشكلة في وقت قياسي وبجودة عالية. أنصح بالتعامل معه.",
          images: [
            "https://images.unsplash.com/photo-1581141849291-1125c7b692b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          ],
          createdAt: "2023-06-18T13:20:00.000Z",
        },
        {
          id: 7,
          bookingId: 7,
          craftsmanId: 2,
          clientId: 1,
          overallRating: 4,
          qualityRating: 5,
          punctualityRating: 3,
          priceRating: 4,
          communicationRating: 4,
          comment:
            "عمل جيد جداً، لكن كان هناك تأخير بسيط في الوصول. الجودة ممتازة والسعر معقول.",
          images: [],
          createdAt: "2023-06-05T10:15:00.000Z",
        },
        {
          id: 8,
          bookingId: 8,
          craftsmanId: 2,
          clientId: 4,
          overallRating: 5,
          qualityRating: 5,
          punctualityRating: 5,
          priceRating: 4,
          communicationRating: 5,
          comment:
            "من أفضل الحرفيين الذين تعاملت معهم. دقيق في العمل ويلتزم بالمواعيد. سأتعامل معه مرة أخرى بالتأكيد.",
          images: [
            "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          ],
          createdAt: "2023-06-22T14:30:00.000Z",
        },
      ],

      // Añadir una nueva evaluación
      addReview: (review) => {
        const newReview = {
          ...review,
          id: Date.now(), // Generación simple de ID
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          reviews: [...state.reviews, newReview],
        }));

        return newReview;
      },

      // Obtener evaluaciones para un artesano específico
      getCraftsmanReviews: (craftsmanId) => {
        const { reviews } = get();

        // Asegurarse de que craftsmanId sea un número
        const craftId = Number(craftsmanId);

        return reviews.filter(review => review.craftsmanId === craftId);
      },

      // Obtener una evaluación específica por ID
      getReviewById: (reviewId) => {
        const { reviews } = get();
        return reviews.find((review) => review.id === reviewId);
      },

      // Obtener la calificación promedio para un artesano
      getCraftsmanAverageRating: (craftsmanId) => {
        const reviews = get().getCraftsmanReviews(craftsmanId);

        if (reviews.length === 0) return 0;

        // Calcular el promedio de la calificación general
        const sum = reviews.reduce(
          (acc, review) => acc + review.overallRating,
          0
        );
        return (sum / reviews.length).toFixed(1);
      },

      // Obtener calificaciones detalladas para un artesano
      getCraftsmanDetailedRatings: (craftsmanId) => {
        // Asegurarse de que craftsmanId sea un número
        const craftId = Number(craftsmanId);

        const reviews = get().getCraftsmanReviews(craftId);

        if (reviews.length === 0) {
          return {
            quality: 0,
            punctuality: 0,
            price: 0,
            communication: 0,
            overall: 0,
          };
        }

        // Calcular promedios para cada criterio
        const quality =
          reviews.reduce((acc, review) => acc + review.qualityRating, 0) /
          reviews.length;
        const punctuality =
          reviews.reduce((acc, review) => acc + review.punctualityRating, 0) /
          reviews.length;
        const price =
          reviews.reduce((acc, review) => acc + review.priceRating, 0) /
          reviews.length;
        const communication =
          reviews.reduce((acc, review) => acc + review.communicationRating, 0) /
          reviews.length;
        const overall =
          reviews.reduce((acc, review) => acc + review.overallRating, 0) /
          reviews.length;

        return {
          quality: quality.toFixed(1),
          punctuality: punctuality.toFixed(1),
          price: price.toFixed(1),
          communication: communication.toFixed(1),
          overall: overall.toFixed(1),
        };
      },
    }),
    {
      name: "jobscope-reviews-storage",
    }
  )
);

export default useReviewStore;

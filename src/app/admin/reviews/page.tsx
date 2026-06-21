"use client";

import { useState, useMemo } from "react";
import { Star, Check, X, Trash2, MessageSquare } from "lucide-react";

type ReviewStatus = "approved" | "pending" | "rejected";

interface ReviewData {
  id: string;
  rating: number;
  title?: string;
  comment: string;
  user: { name: string; email: string };
  productName: string;
  status: ReviewStatus;
  date: string;
}

const mockReviews: ReviewData[] = [
  {
    id: "r1",
    rating: 5,
    title: "Найкраща футболка!",
    comment:
      "Купив для тренувань у залі. Компресія відчувається, матеріал дуже приємний. Рекомендую!",
    user: { name: "Олександр", email: "oleksandr@test.com" },
    productName: "Компресійна футболка Pro Max",
    status: "approved",
    date: "15.05.2026",
  },
  {
    id: "r2",
    rating: 4,
    title: "Гарна якість",
    comment:
      "Якість на висоті, але хотілося б більше розмірів в наявності.",
    user: { name: "Марія", email: "maria@test.com" },
    productName: "Компресійна футболка Pro Max",
    status: "approved",
    date: "20.05.2026",
  },
  {
    id: "r3",
    rating: 5,
    title: "Топ якість!",
    comment:
      "Використовую для тренувань MMA. Рашгард тримається ідеально, компресія відмінна.",
    user: { name: "Дмитро", email: "dmytro@test.com" },
    productName: "Рашгард Pro Compression",
    status: "approved",
    date: "25.05.2026",
  },
  {
    id: "r4",
    rating: 3,
    title: "Нормально",
    comment: "Нормальний товар, але доставка була довгою.",
    user: { name: "Анна", email: "anna@test.com" },
    productName: "Компресійні шорти Elite",
    status: "pending",
    date: "18.06.2026",
  },
  {
    id: "r5",
    rating: 2,
    title: "Не сподобалось",
    comment:
      "Розмір не відповідає таблиці. Замовив L, але виявився завеликий.",
    user: { name: "Іван", email: "ivan@test.com" },
    productName: "Жіночі компресійні легінси Flex",
    status: "pending",
    date: "20.06.2026",
  },
  {
    id: "r6",
    rating: 1,
    title: "Шлюб",
    comment: "Прийшов з дефектом. Шви розійшлися після першого прання.",
    user: { name: "Тетяна", email: "tetiana@test.com" },
    productName: "Дитяча компресійна футболка Junior",
    status: "pending",
    date: "19.06.2026",
  },
  {
    id: "r7",
    rating: 5,
    title: "Відмінний комплект",
    comment:
      "Комплект неймовірний. Компресія відчувається на всіх м'язах. Матеріал преміум.",
    user: { name: "Андрій", email: "andriy@test.com" },
    productName: "Чоловічий компресійний комплект Apex",
    status: "approved",
    date: "01.06.2026",
  },
  {
    id: "r8",
    rating: 4,
    title: "Гарна термобілизна",
    comment: "Тримає тепло, компресія відчувається. Єдиний мінус - важко прати.",
    user: { name: "Олена", email: "olena@test.com" },
    productName: "Термокомпресійна футболка Thermo",
    status: "rejected",
    date: "10.06.2026",
  },
];

const statusTabs: { label: string; value: ReviewStatus | "ALL" }[] = [
  { label: "Всі", value: "ALL" },
  { label: "Очікують", value: "pending" },
  { label: "Затверджені", value: "approved" },
  { label: "Відхилені", value: "rejected" },
];

const statusColors: Record<ReviewStatus, string> = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
};

const statusLabels: Record<ReviewStatus, string> = {
  approved: "Затверджено",
  pending: "Очікує",
  rejected: "Відхилено",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(mockReviews);
  const [activeTab, setActiveTab] = useState<ReviewStatus | "ALL">("ALL");

  const filteredReviews = useMemo(() => {
    if (activeTab === "ALL") return reviews;
    return reviews.filter((r) => r.status === activeTab);
  }, [reviews, activeTab]);

  const updateStatus = (id: string, status: ReviewStatus) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Модерація відгуків
        </h2>
        <p className="text-sm text-gray-500">
          {reviews.length} відгуків, {reviews.filter((r) => r.status === "pending").length} очікують модерації
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-[#E31837] text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab.label}
            {tab.value !== "ALL" && (
              <span className="ml-1.5 text-xs opacity-75">
                ({reviews.filter((r) => r.status === tab.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <StarRating rating={review.rating} />
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      statusColors[review.status]
                    }`}
                  >
                    {statusLabels[review.status]}
                  </span>
                </div>

                {review.title && (
                  <h3 className="text-sm font-semibold text-gray-900">
                    {review.title}
                  </h3>
                )}

                <p className="text-sm text-gray-600">{review.comment}</p>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {review.productName}
                  </span>
                  <span>
                    {review.user.name} ({review.user.email})
                  </span>
                  <span>{review.date}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {review.status !== "approved" && (
                  <button
                    onClick={() => updateStatus(review.id, "approved")}
                    className="rounded-lg bg-green-50 p-2 text-green-600 hover:bg-green-100 transition-colors"
                    title="Затвердити"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
                {review.status !== "rejected" && (
                  <button
                    onClick={() => updateStatus(review.id, "rejected")}
                    className="rounded-lg bg-yellow-50 p-2 text-yellow-600 hover:bg-yellow-100 transition-colors"
                    title="Відхилити"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteReview(review.id)}
                  className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 transition-colors"
                  title="Видалити"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white py-12 text-center">
            <MessageSquare className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm text-gray-500">Відгуків не знайдено</p>
          </div>
        )}
      </div>
    </div>
  );
}

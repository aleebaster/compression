"use client";

import { useState, useMemo } from "react";
import { Star, Check, X, Trash2, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import { useAdminReviews } from "@/lib/admin-store";

type ReviewStatus = "approved" | "pending" | "rejected";

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
  const { reviews, approveReview, rejectReview, deleteReview } = useAdminReviews();
  const [activeTab, setActiveTab] = useState<ReviewStatus | "ALL">("ALL");

  const filteredReviews = useMemo(() => {
    if (activeTab === "ALL") return reviews;
    return reviews.filter((r) =>
      activeTab === "approved" ? r.isApproved : activeTab === "pending" ? !r.isApproved : false
    );
  }, [reviews, activeTab]);

  const getReviewStatus = (isApproved: boolean): ReviewStatus => {
    return isApproved ? "approved" : "pending";
  };

  const handleApprove = (id: string) => {
    approveReview(id);
    toast.success("Відгук затверджено");
  };

  const handleReject = (id: string) => {
    rejectReview(id);
    toast.success("Відгук відхилено");
  };

  const handleDelete = (id: string) => {
    if (confirm("Видалити відгук?")) {
      deleteReview(id);
      toast.success("Відгук видалено");
    }
  };

  const pendingCount = reviews.filter((r) => !r.isApproved).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Модерація відгуків
        </h2>
        <p className="text-sm text-gray-500">
          {reviews.length} відгуків, {pendingCount} очікують модерації
        </p>
      </div>

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
                ({tab.value === "approved"
                  ? reviews.filter((r) => r.isApproved).length
                  : tab.value === "pending"
                  ? reviews.filter((r) => !r.isApproved).length
                  : 0})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredReviews.map((review) => {
          const status = getReviewStatus(review.isApproved);
          return (
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
                        statusColors[status]
                      }`}
                    >
                      {statusLabels[status]}
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
                      ID: {review.productId}
                    </span>
                    <span>
                      {review.user.name} ({review.user.email})
                    </span>
                    <span>
                      {new Date(review.createdAt).toLocaleDateString("uk-UA")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!review.isApproved && (
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="rounded-lg bg-green-50 p-2 text-green-600 hover:bg-green-100 transition-colors"
                      title="Затвердити"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  {review.isApproved && (
                    <button
                      onClick={() => handleReject(review.id)}
                      className="rounded-lg bg-yellow-50 p-2 text-yellow-600 hover:bg-yellow-100 transition-colors"
                      title="Відхилити"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 transition-colors"
                    title="Видалити"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

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

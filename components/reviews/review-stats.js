// components/reviews/review-stats.js
"use client"
import { Progress } from "@/components/ui/progress"; // Đảm bảo bạn có component này từ shadcn
import { StarRating } from "./star-rating";

export function ReviewStats({ stats }) {
  if (!stats) return null;

  // stats backend trả về: { averageRating, totalReviews, ratingCounts: {1: 0, 2: 1, 3: 5...} }
  const { averageRating, totalReviews, ratingCounts } = stats;

  return (
    <div className="grid gap-6 md:grid-cols-12">
      {/* Cột trái: Điểm tổng */}
      <div className="md:col-span-4 flex flex-col items-center justify-center text-center space-y-2 p-4 bg-slate-50 rounded-lg">
        <div className="text-5xl font-bold text-primary">{averageRating.toFixed(1)}</div>
        <StarRating rating={averageRating} size={24} />
        <div className="text-sm text-muted-foreground">({totalReviews} đánh giá)</div>
      </div>

      {/* Cột phải: Progress bars */}
      <div className="md:col-span-8 space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = ratingCounts ? ratingCounts[star] || 0 : 0;
          const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          
          return (
            <div key={star} className="flex items-center gap-3 text-sm">
              <div className="w-12 flex items-center gap-1 font-medium">
                {star} <span className="text-yellow-500">★</span>
              </div>
              <Progress value={percent} className="h-2 flex-1" />
              <div className="w-10 text-right text-muted-foreground">{percent.toFixed(0)}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPublicCourseReviews, getCourseReviewStats } from "@/lib/api/review";
import { ReviewStats } from "@/components/reviews/review-stats";
import { StarRating } from "@/components/reviews/star-rating";
import { toast } from "sonner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function InstructorCourseReviewsPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function loadData() {
      if (!courseId) return;
      setLoading(true);
      try {
        const [statsRes, reviewsRes] = await Promise.all([
          getCourseReviewStats(courseId),
          getPublicCourseReviews(courseId, { page: 0, size: 50 }), // Load nhiều hơn cho instructor
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (reviewsRes.success) setReviews(reviewsRes.data?.content || []);
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải dữ liệu đánh giá");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/instructor/courses/${courseId}`)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại khóa học
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Đánh giá & Phản hồi</h1>
          <p className="text-muted-foreground text-sm">
            Xem ý kiến của học viên về khóa học này
          </p>
        </div>
      </div>

      {/* Stats Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Tổng quan</CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewStats stats={stats} />
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="grid gap-4">
        <h2 className="text-xl font-semibold mt-4">
          Danh sách đánh giá ({reviews.length})
        </h2>

        {reviews.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Chưa có đánh giá nào cho khóa học này.
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={review.userAvatarUrl} />
                    <AvatarFallback>{review.userName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-sm">{review.userName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={review.rating} size={14} />
                          <span className="text-xs text-muted-foreground">
                            • {format(new Date(review.createdAt), "PP p", { locale: vi })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-700 bg-muted/30 p-3 rounded-lg">
                      {review.comment || <span className="italic text-muted-foreground">Không có nội dung</span>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
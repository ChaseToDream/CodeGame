"use client";

import { useState } from "react";
import { useUserStore } from "@/stores/user-store";
import { useShallow } from "zustand/react/shallow";
import { cn, timeAgo } from "@/lib/utils";
import type { CourseRating } from "@/types";

interface CourseRatingPanelProps {
  courseId: string;
}

/**
 * 课程评价面板：用户提交评分与评论 + 显示历史评价。
 *
 * 设计要点：
 * - 5 星交互式评分（hover 预览 + click 提交）
 * - 评论可选（最长 500 字符，store 内会截断）
 * - 已评价用户显示"更新评价"模式，未评价显示"提交评价"
 * - 显示当前用户的评价历史（如有）
 * - 首次评价会发放 5 XP 奖励（store 内处理）
 *
 * 注：由于本项目无后端，仅展示当前用户自己的评价。
 * 真实平台会聚合显示所有用户的评分平均值与最新评价。
 */
export function CourseRatingPanel({ courseId }: CourseRatingPanelProps) {
  const { myRating, upsertRating } = useUserStore(
    useShallow((s) => ({
      myRating: s.getCourseRating(courseId),
      upsertRating: s.upsertCourseRating,
    })),
  );

  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(myRating?.rating ?? 0);
  const [comment, setComment] = useState(myRating?.comment ?? "");
  const [submitted, setSubmitted] = useState(false);

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (selectedRating < 1 || selectedRating > 5) return;
    upsertRating(courseId, selectedRating, comment);
    setSubmitted(true);
    // 2 秒后隐藏成功提示
    setTimeout(() => setSubmitted(false), 2000);
  };

  const displayRating = hoverRating || selectedRating;

  return (
    <section className="rounded-xl border border-rule bg-bg2 p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="font-outfit text-lg font-bold flex items-center gap-2">
          <span>⭐</span> 课程评价
        </h3>
        {myRating && (
          <span className="text-xs text-muted">
            你的评价 · {timeAgo(myRating.createdAt)}
          </span>
        )}
      </div>

      {/* 评分输入 */}
      <div className="mb-4">
        <div className="text-sm text-muted mb-2">
          {myRating ? "更新你的评分：" : "为这门课程评分："}
        </div>
        <div
          className="flex items-center gap-1"
          onMouseLeave={() => setHoverRating(0)}
          role="radiogroup"
          aria-label="评分（1 到 5 星）"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => setHoverRating(star)}
              className="p-1 text-2xl transition-transform hover:scale-110"
              aria-label={`${star} 星`}
              aria-checked={selectedRating === star}
              role="radio"
            >
              <span
                className={cn(
                  "transition-colors",
                  star <= displayRating ? "text-warning" : "text-bg3",
                )}
              >
                {star <= displayRating ? "★" : "☆"}
              </span>
            </button>
          ))}
          {selectedRating > 0 && (
            <span className="ml-2 text-sm font-bold text-ink">
              {selectedRating} / 5
            </span>
          )}
        </div>
      </div>

      {/* 评论输入 */}
      <div className="mb-4">
        <label
          htmlFor={`rating-comment-${courseId}`}
          className="text-sm text-muted mb-2 block"
        >
          评论（可选，最多 500 字符）：
        </label>
        <textarea
          id={`rating-comment-${courseId}`}
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 500))}
          placeholder="分享你对这门课程的看法、亮点或建议..."
          rows={3}
          className="w-full rounded-lg border border-rule bg-bg3 px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-accent transition resize-none"
        />
        <div className="text-right text-[10px] text-muted mt-1">
          {comment.length} / 500
        </div>
      </div>

      {/* 提交按钮 */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={selectedRating < 1}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-semibold transition",
            selectedRating < 1
              ? "bg-bg3 text-muted cursor-not-allowed"
              : "bg-gradient-to-r from-accent to-accent2 text-white hover:shadow-glow",
          )}
        >
          {myRating ? "更新评价" : "提交评价"}
        </button>
        {submitted && (
          <span className="text-sm text-success font-medium">
            ✓ 评价已保存{!myRating ? "，获得 +5 XP！" : ""}
          </span>
        )}
        {selectedRating >= 1 && !submitted && (
          <span className="text-xs text-muted">
            {selectedRating === 5
              ? "🌟 非常推荐！"
              : selectedRating === 4
                ? "👍 不错"
                : selectedRating === 3
                  ? "😊 还行"
                  : selectedRating === 2
                    ? "🤔 有改进空间"
                    : "📝 不太推荐"}
          </span>
        )}
      </div>

      {/* 我的评价历史 */}
      {myRating && (
        <div className="mt-5 pt-5 border-t border-rule">
          <div className="text-xs text-muted uppercase tracking-wide mb-2">
            我的评价
          </div>
          <MyRatingCard rating={myRating} />
        </div>
      )}
    </section>
  );
}

/**
 * 单条评价卡片：显示评分、评论、时间。
 */
function MyRatingCard({ rating }: { rating: CourseRating }) {
  return (
    <div className="rounded-lg border border-rule bg-bg3 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={cn(
                "text-sm",
                star <= rating.rating ? "text-warning" : "text-bg3",
              )}
            >
              ★
            </span>
          ))}
          <span className="ml-2 text-xs text-muted">{timeAgo(rating.createdAt)}</span>
        </div>
      </div>
      {rating.comment ? (
        <p className="text-sm text-ink whitespace-pre-wrap">{rating.comment}</p>
      ) : (
        <p className="text-sm text-muted italic">未填写评论</p>
      )}
    </div>
  );
}

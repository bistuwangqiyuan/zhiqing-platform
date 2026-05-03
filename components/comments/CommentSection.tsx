"use client";
import { useEffect, useState } from "react";
import { Heart, MessageCircle, Send, User } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: number;
  likes: number;
  replies?: Comment[];
}

const SEED: Record<string, Comment[]> = {
  "what-pre-founders-actually-need": [
    {
      id: "c1", author: "Wei Zhang", createdAt: Date.now() - 86400000 * 3, likes: 23,
      text: "「证伪比证成更重要」——这一句让我把团队 6 个月的假设全部重新过了一遍。第二轮我们筛掉了 11 个未经证实的关键假设。",
      replies: [
        { id: "c1-r1", author: "智擎团队", createdAt: Date.now() - 86400000 * 2, likes: 8, text: "感谢分享。如果方便，我们可以为你团队做一次免费的反向情景压力测试。" }
      ]
    },
    {
      id: "c2", author: "MiraN", createdAt: Date.now() - 86400000 * 5, likes: 12,
      text: "对照组的概念在创业前期太被低估了。希望未来能看到更详细的对照实验方法论。"
    }
  ],
  "5-percent-equity-economics": [
    {
      id: "c3", author: "Henry C.", createdAt: Date.now() - 86400000 * 7, likes: 19,
      text: "5% 反稀释保护具体怎么设计？是棘轮还是加权平均？看到一些文章说棘轮过于苛刻。"
    }
  ],
  "monte-carlo-decision-making": [
    {
      id: "c4", author: "Xinran L.", createdAt: Date.now() - 86400000 * 10, likes: 31,
      text: "把 P10/P50/P90 默认在所有数字旁边显示——这个 UX 设计太对了。"
    }
  ]
};

const STORAGE_PREFIX = "zq_comments_";

export function CommentSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_PREFIX + slug) : null;
    setComments(stored ? JSON.parse(stored) : SEED[slug] ?? []);
  }, [slug]);

  function persist(next: Comment[]) {
    setComments(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_PREFIX + slug, JSON.stringify(next));
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name, text })
      });
    } catch {}
    const newC: Comment = {
      id: `c-${Date.now()}`,
      author: name.trim(),
      text: text.trim(),
      createdAt: Date.now(),
      likes: 0,
      replies: []
    };
    persist([newC, ...comments]);
    setText("");
    setSubmitting(false);
  }

  function toggleLike(id: string) {
    if (liked[id]) return;
    setLiked({ ...liked, [id]: true });
    const update = (list: Comment[]): Comment[] =>
      list.map((c) =>
        c.id === id
          ? { ...c, likes: c.likes + 1 }
          : { ...c, replies: c.replies ? update(c.replies) : c.replies }
      );
    persist(update(comments));
  }

  function submitReply(parentId: string) {
    if (!replyText.trim() || !name.trim()) return;
    const reply: Comment = {
      id: `c-${Date.now()}`,
      author: name.trim(),
      text: replyText.trim(),
      createdAt: Date.now(),
      likes: 0
    };
    const next = comments.map((c) =>
      c.id === parentId ? { ...c, replies: [...(c.replies ?? []), reply] } : c
    );
    persist(next);
    setReplyText("");
    setReplyingTo(null);
  }

  return (
    <div>
      <h3 className="text-display-md font-semibold text-ink-900 tracking-snug">
        评论 <span className="text-ink-400 text-[20px] ml-1">{countAll(comments)}</span>
      </h3>

      <form onSubmit={submit} className="mt-6 rounded-2xl border border-ink-100 bg-white p-6">
        <div className="flex gap-4">
          <span className="h-10 w-10 rounded-full bg-gradient-to-br from-ink-300 to-ink-700 flex-shrink-0 grid place-items-center text-white">
            <User className="h-4 w-4" />
          </span>
          <div className="flex-1 space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="你的名字"
              className="w-full h-10 px-4 rounded-full border border-ink-200 focus:outline-none focus:border-ink-700 text-[14px]"
              required
            />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="参与讨论 · 提出反向证伪 · 分享你的判断"
              rows={3}
              className="w-full px-4 py-3 rounded-2xl border border-ink-200 focus:outline-none focus:border-ink-700 text-[14px] resize-none"
              required
            />
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-ink-400">{text.length}/600 · 支持 Markdown · 评论将公开显示</p>
              <button type="submit" disabled={submitting} className="btn-primary px-5 py-2 text-[13px]">
                <Send className="h-3.5 w-3.5" />
                发布
              </button>
            </div>
          </div>
        </div>
      </form>

      <ul className="mt-8 space-y-6">
        {comments.map((c) => (
          <li key={c.id}>
            <CommentNode
              comment={c}
              onLike={toggleLike}
              liked={liked}
              onReply={(id: string) => setReplyingTo(id)}
              isReplyingTo={replyingTo === c.id}
              replyText={replyText}
              setReplyText={setReplyText}
              submitReply={submitReply}
              name={name}
              setName={setName}
            />
          </li>
        ))}
      </ul>

      {comments.length === 0 && (
        <p className="mt-8 text-center text-[13px] text-ink-400">还没有评论，做第一个吧。</p>
      )}
    </div>
  );
}

function CommentNode({
  comment, onLike, liked, onReply, isReplyingTo, replyText, setReplyText, submitReply, name, setName
}: any) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5">
      <div className="flex gap-4">
        <span className="h-9 w-9 rounded-full bg-gradient-to-br from-ink-300 to-ink-700 flex-shrink-0 grid place-items-center text-white text-[12px] font-semibold">
          {comment.author[0]?.toUpperCase()}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-semibold text-ink-900">{comment.author}</p>
            <p className="text-[11px] text-ink-400">{relTime(comment.createdAt)}</p>
          </div>
          <p className="mt-2 text-[14px] text-ink-700 leading-relaxed whitespace-pre-wrap break-words">
            {comment.text}
          </p>
          <div className="mt-3 flex items-center gap-4 text-[12px] text-ink-500">
            <button onClick={() => onLike(comment.id)} className={`inline-flex items-center gap-1 transition-colors ${liked[comment.id] ? "text-red-500" : "hover:text-ink-700"}`}>
              <Heart className="h-3.5 w-3.5" fill={liked[comment.id] ? "currentColor" : "none"} />
              {comment.likes}
            </button>
            <button onClick={() => onReply(comment.id)} className="inline-flex items-center gap-1 hover:text-ink-700">
              <MessageCircle className="h-3.5 w-3.5" />
              回复
            </button>
          </div>

          {isReplyingTo && (
            <div className="mt-4 rounded-xl border border-ink-200 bg-ink-50/50 p-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="你的名字"
                className="w-full h-9 px-3 rounded-lg border border-ink-200 focus:outline-none focus:border-ink-700 text-[13px] mb-2"
              />
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="回复..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-ink-200 focus:outline-none focus:border-ink-700 text-[13px] resize-none"
              />
              <div className="mt-2 flex justify-end">
                <button onClick={() => submitReply(comment.id)} className="btn-primary px-4 py-1.5 text-[12px]">
                  发送
                </button>
              </div>
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <ul className="mt-5 space-y-4 pl-5 border-l-2 border-ink-100">
              {comment.replies.map((r: any) => (
                <li key={r.id}>
                  <CommentNode
                    comment={r}
                    onLike={onLike}
                    liked={liked}
                    onReply={() => {}}
                    isReplyingTo={false}
                    replyText=""
                    setReplyText={() => {}}
                    submitReply={() => {}}
                    name={name}
                    setName={setName}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function countAll(list: Comment[]): number {
  return list.reduce((acc, c) => acc + 1 + (c.replies ? countAll(c.replies) : 0), 0);
}

function relTime(t: number): string {
  const diff = Date.now() - t;
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "刚刚";
  if (min < 60) return `${min} 分钟前`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} 小时前`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} 天前`;
  return new Date(t).toLocaleDateString("zh-CN");
}

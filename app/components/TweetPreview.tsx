"use client";

interface TweetPreviewProps {
  text: string;
  label?: string;
  onPost?: () => void;
  onQueue?: () => void;
  onEdit?: (text: string) => void;
  posting?: boolean;
  queuing?: boolean;
  editable?: boolean;
}

export default function TweetPreview({
  text,
  label,
  onPost,
  onQueue,
  onEdit,
  posting,
  queuing,
  editable = false,
}: TweetPreviewProps) {
  const charCount = text.length;
  const isOverLimit = charCount > 280;
  const isNearLimit = charCount > 250;

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
      {label && (
        <div className="px-4 pt-3">
          <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
            {label}
          </span>
        </div>
      )}

      <div className="p-4">
        {editable ? (
          <textarea
            value={text}
            onChange={(e) => onEdit?.(e.target.value)}
            className="w-full bg-gray-800 text-white text-sm rounded-lg p-3 resize-none outline-none focus:ring-1 focus:ring-blue-500 border border-gray-700 min-h-[100px] leading-relaxed"
            rows={4}
          />
        ) : (
          <p className="text-white text-sm whitespace-pre-wrap leading-relaxed">
            {text}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800 bg-gray-900/50">
        <span
          className={`text-xs font-mono ${
            isOverLimit
              ? "text-red-400 font-bold"
              : isNearLimit
                ? "text-yellow-400"
                : "text-gray-500"
          }`}
        >
          {charCount}/280
        </span>
        <div className="flex gap-2">
          {onQueue && (
            <button
              onClick={onQueue}
              disabled={queuing || isOverLimit}
              className="px-4 py-1.5 text-xs font-medium bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-40 transition"
            >
              {queuing ? "追加中..." : "予約に追加"}
            </button>
          )}
          {onPost && (
            <button
              onClick={onPost}
              disabled={posting || isOverLimit}
              className="px-4 py-1.5 text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-40 transition"
            >
              {posting ? "投稿中..." : "Xに投稿"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

interface TweetPreviewProps {
  text: string;
  onPost?: () => void;
  onQueue?: () => void;
  onEdit?: (text: string) => void;
  posting?: boolean;
  queuing?: boolean;
  editable?: boolean;
}

export default function TweetPreview({
  text,
  onPost,
  onQueue,
  onEdit,
  posting,
  queuing,
  editable = false,
}: TweetPreviewProps) {
  const charCount = text.length;
  const isOverLimit = charCount > 280;

  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
      {editable ? (
        <textarea
          value={text}
          onChange={(e) => onEdit?.(e.target.value)}
          className="w-full bg-transparent text-white text-sm resize-none outline-none min-h-[80px]"
          rows={3}
        />
      ) : (
        <p className="text-white text-sm whitespace-pre-wrap">{text}</p>
      )}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
        <span className={`text-xs ${isOverLimit ? "text-red-400" : "text-gray-400"}`}>
          {charCount}/280
        </span>
        <div className="flex gap-2">
          {onQueue && (
            <button
              onClick={onQueue}
              disabled={queuing || isOverLimit}
              className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 transition"
            >
              {queuing ? "追加中..." : "予約に追加"}
            </button>
          )}
          {onPost && (
            <button
              onClick={onPost}
              disabled={posting || isOverLimit}
              className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 transition"
            >
              {posting ? "投稿中..." : "即投稿"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

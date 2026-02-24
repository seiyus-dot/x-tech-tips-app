import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "\u30d6\u30ed\u30b0 | Nail Salon Lumiere",
  description: "\u30cd\u30a4\u30eb\u30b5\u30ed\u30f3 \u30eb\u30df\u30a8\u30fc\u30eb\u306e\u30d6\u30ed\u30b0\u3002\u30cd\u30a4\u30eb\u30b1\u30a2\u306e\u30b3\u30c4\u3084\u6700\u65b0\u30c8\u30ec\u30f3\u30c9\u60c5\u5831\u3092\u304a\u5c4a\u3051\u3057\u307e\u3059\u3002",
};

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "spring-nail-trends",
    title: "2026\u5e74\u6625\u306e\u30cd\u30a4\u30eb\u30c8\u30ec\u30f3\u30c9\u307e\u3068\u3081",
    excerpt:
      "\u4eca\u5e74\u306e\u6625\u306f\u30d1\u30b9\u30c6\u30eb\u30ab\u30e9\u30fc\u3068\u30d5\u30e9\u30ef\u30fc\u30e2\u30c1\u30fc\u30d5\u304c\u30c8\u30ec\u30f3\u30c9\u3002\u6307\u5148\u304b\u3089\u5b63\u7bc0\u3092\u611f\u3058\u308b\u30c7\u30b6\u30a4\u30f3\u3092\u3054\u7d39\u4ecb\u3057\u307e\u3059\u3002",
    date: "2026-02-20",
    category: "\u30c8\u30ec\u30f3\u30c9",
  },
  {
    id: "nail-care-tips",
    title: "\u81ea\u5b85\u3067\u3067\u304d\u308b\uff01\u30cd\u30a4\u30eb\u30b1\u30a2\u306e\u57fa\u672c",
    excerpt:
      "\u30b5\u30ed\u30f3\u306b\u884c\u304b\u306a\u3044\u65e5\u3082\u7f8e\u3057\u3044\u6307\u5148\u3092\u4fdd\u3064\u305f\u3081\u306e\u3001\u65e5\u3005\u306e\u30b1\u30a2\u65b9\u6cd5\u3092\u30d7\u30ed\u304c\u89e3\u8aac\u3057\u307e\u3059\u3002",
    date: "2026-02-15",
    category: "\u30b1\u30a2",
  },
  {
    id: "gel-vs-manicure",
    title: "\u30b8\u30a7\u30eb\u30cd\u30a4\u30eb\u3068\u30de\u30cb\u30ad\u30e5\u30a2\u306e\u9055\u3044\u3068\u306f\uff1f",
    excerpt:
      "\u521d\u3081\u3066\u306e\u65b9\u306b\u3082\u308f\u304b\u308a\u3084\u3059\u304f\u3001\u30b8\u30a7\u30eb\u30cd\u30a4\u30eb\u3068\u30de\u30cb\u30ad\u30e5\u30a2\u306e\u305d\u308c\u305e\u308c\u306e\u30e1\u30ea\u30c3\u30c8\u30fb\u30c7\u30e1\u30ea\u30c3\u30c8\u3092\u89e3\u8aac\u3057\u307e\u3059\u3002",
    date: "2026-02-10",
    category: "\u77e5\u8b58",
  },
  {
    id: "bridal-nail",
    title: "\u30d6\u30e9\u30a4\u30c0\u30eb\u30cd\u30a4\u30eb\u306e\u9078\u3073\u65b9\u30ac\u30a4\u30c9",
    excerpt:
      "\u4e00\u751f\u306b\u4e00\u5ea6\u306e\u7279\u5225\u306a\u65e5\u3002\u30c9\u30ec\u30b9\u3084\u30d6\u30fc\u30b1\u306b\u5408\u308f\u305b\u305f\u30d6\u30e9\u30a4\u30c0\u30eb\u30cd\u30a4\u30eb\u306e\u9078\u3073\u65b9\u3092\u3054\u7d39\u4ecb\u3002",
    date: "2026-02-05",
    category: "\u30d6\u30e9\u30a4\u30c0\u30eb",
  },
  {
    id: "winter-dry-skin",
    title: "\u51ac\u306e\u4e7e\u71e5\u5bfe\u7b56\uff01\u624b\u5143\u306e\u4fdd\u6e7f\u30b1\u30a2",
    excerpt:
      "\u4e7e\u71e5\u304c\u6c17\u306b\u306a\u308b\u5b63\u7bc0\u3001\u624b\u5143\u306e\u4fdd\u6e7f\u30b1\u30a2\u3067\u7f8e\u3057\u3044\u6307\u5148\u3092\u30ad\u30fc\u30d7\u3059\u308b\u65b9\u6cd5\u3092\u304a\u4f1d\u3048\u3057\u307e\u3059\u3002",
    date: "2026-01-25",
    category: "\u30b1\u30a2",
  },
  {
    id: "salon-open-anniversary",
    title: "\u30eb\u30df\u30a8\u30fc\u30eb3\u5468\u5e74\u8a18\u5ff5\u30ad\u30e3\u30f3\u30da\u30fc\u30f3\u306e\u304a\u77e5\u3089\u305b",
    excerpt:
      "\u65e5\u9803\u306e\u611f\u8b1d\u3092\u8fbc\u3081\u3066\u30013\u5468\u5e74\u8a18\u5ff5\u306e\u7279\u5225\u30ad\u30e3\u30f3\u30da\u30fc\u30f3\u3092\u958b\u50ac\u3044\u305f\u3057\u307e\u3059\u3002\u304a\u5f97\u306a\u30e1\u30cb\u30e5\u30fc\u3092\u3054\u7528\u610f\uff01",
    date: "2026-01-20",
    category: "\u304a\u77e5\u3089\u305b",
  },
];

const categoryColors: Record<string, string> = {
  "\u30c8\u30ec\u30f3\u30c9": "bg-pink-100 text-pink-700",
  "\u30b1\u30a2": "bg-green-100 text-green-700",
  "\u77e5\u8b58": "bg-blue-100 text-blue-700",
  "\u30d6\u30e9\u30a4\u30c0\u30eb": "bg-purple-100 text-purple-700",
  "\u304a\u77e5\u3089\u305b": "bg-amber-100 text-amber-700",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}\u5e74${d.getMonth() + 1}\u6708${d.getDate()}\u65e5`;
}

export default function BlogPage() {
  return (
    <>
      {/* Page Header */}
      <section className="py-16 px-4 hero-gradient text-white text-center">
        <p className="text-sm tracking-[0.3em] uppercase mb-2 opacity-90">
          Blog
        </p>
        <h1 className="text-3xl md:text-4xl font-bold">\u30d6\u30ed\u30b0</h1>
        <p className="mt-3 opacity-90">
          \u30cd\u30a4\u30eb\u30b1\u30a2\u306e\u30b3\u30c4\u3084\u6700\u65b0\u60c5\u5831\u3092\u304a\u5c4a\u3051\u3057\u307e\u3059
        </p>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {blogPosts.map((post) => (
              <article key={post.id} className="card p-6 flex flex-col sm:flex-row gap-5">
                {/* Thumbnail placeholder */}
                <div className="w-full sm:w-40 h-32 bg-primary-light/30 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-4xl opacity-30">&#x1f4dd;</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${categoryColors[post.category] || "bg-gray-100 text-gray-600"}`}
                    >
                      {post.category}
                    </span>
                    <time className="text-xs text-gray-400">
                      {formatDate(post.date)}
                    </time>
                  </div>
                  <h2 className="font-bold text-lg mb-2">
                    <Link
                      href={`/blog/${post.id}`}
                      className="hover:text-primary-dark transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-block mt-3 text-sm text-primary-dark hover:underline"
                  >
                    \u7d9a\u304d\u3092\u8aad\u3080 &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

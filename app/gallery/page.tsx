"use client";

import { useState } from "react";
import type { Metadata } from "next";

const categories = [
  "\u3059\u3079\u3066",
  "\u30b7\u30f3\u30d7\u30eb",
  "\u30c8\u30ec\u30f3\u30c9",
  "\u30a2\u30fc\u30c8",
  "\u30d5\u30c3\u30c8",
  "\u30d6\u30e9\u30a4\u30c0\u30eb",
];

interface GalleryItem {
  id: number;
  category: string;
  title: string;
  description: string;
}

const galleryItems: GalleryItem[] = [
  { id: 1, category: "\u30b7\u30f3\u30d7\u30eb", title: "\u30cc\u30fc\u30c7\u30a3\u30d9\u30fc\u30b8\u30e5\u30ef\u30f3\u30ab\u30e9\u30fc", description: "\u30aa\u30d5\u30a3\u30b9\u306b\u3082\u3074\u3063\u305f\u308a\u306e\u4e0a\u54c1\u30ab\u30e9\u30fc" },
  { id: 2, category: "\u30c8\u30ec\u30f3\u30c9", title: "\u30df\u30e9\u30fc\u30cd\u30a4\u30eb", description: "\u5149\u3092\u53cd\u5c04\u3057\u3066\u8f1d\u304f\u30c8\u30ec\u30f3\u30c9\u30c7\u30b6\u30a4\u30f3" },
  { id: 3, category: "\u30a2\u30fc\u30c8", title: "\u30dc\u30bf\u30cb\u30ab\u30eb\u30a2\u30fc\u30c8", description: "\u7e4a\u7d30\u306a\u82b1\u67c4\u3092\u624b\u63cf\u304d\u3067" },
  { id: 4, category: "\u30b7\u30f3\u30d7\u30eb", title: "\u30d4\u30f3\u30af\u30b0\u30e9\u30c7\u30fc\u30b7\u30e7\u30f3", description: "\u512a\u3057\u3044\u30d4\u30f3\u30af\u306e\u30b0\u30e9\u30c7\u30fc\u30b7\u30e7\u30f3" },
  { id: 5, category: "\u30d5\u30c3\u30c8", title: "\u30b5\u30de\u30fc\u30d5\u30c3\u30c8\u30cd\u30a4\u30eb", description: "\u723d\u3084\u304b\u306a\u30d6\u30eb\u30fc\u306e\u30d5\u30c3\u30c8\u30c7\u30b6\u30a4\u30f3" },
  { id: 6, category: "\u30c8\u30ec\u30f3\u30c9", title: "\u30de\u30b0\u30cd\u30c3\u30c8\u30cd\u30a4\u30eb", description: "\u30de\u30b0\u30cd\u30c3\u30c8\u3092\u4f7f\u3063\u305f\u5e7b\u60f3\u7684\u306a\u30c7\u30b6\u30a4\u30f3" },
  { id: 7, category: "\u30a2\u30fc\u30c8", title: "\u5927\u7406\u77f3\u98a8\u30a2\u30fc\u30c8", description: "\u9ad8\u7d1a\u611f\u306e\u3042\u308b\u5927\u7406\u77f3\u30c7\u30b6\u30a4\u30f3" },
  { id: 8, category: "\u30d6\u30e9\u30a4\u30c0\u30eb", title: "\u30d6\u30e9\u30a4\u30c0\u30eb\u30cd\u30a4\u30eb", description: "\u7279\u5225\u306a\u65e5\u306e\u305f\u3081\u306e\u83ef\u3084\u304b\u306a\u30c7\u30b6\u30a4\u30f3" },
  { id: 9, category: "\u30b7\u30f3\u30d7\u30eb", title: "\u30af\u30ea\u30a2\u30b8\u30a7\u30eb", description: "\u900f\u660e\u611f\u306e\u3042\u308b\u30af\u30ea\u30a2\u30b8\u30a7\u30eb" },
  { id: 10, category: "\u30c8\u30ec\u30f3\u30c9", title: "\u30aa\u30fc\u30ed\u30e9\u30cd\u30a4\u30eb", description: "\u5149\u306e\u89d2\u5ea6\u3067\u8272\u304c\u5909\u308f\u308b\u795e\u79d8\u7684\u306a\u30cd\u30a4\u30eb" },
  { id: 11, category: "\u30a2\u30fc\u30c8", title: "\u548c\u67c4\u30a2\u30fc\u30c8", description: "\u7f8e\u3057\u3044\u548c\u67c4\u3092\u6307\u5148\u306b" },
  { id: 12, category: "\u30d5\u30c3\u30c8", title: "\u30da\u30c7\u30a3\u30ad\u30e5\u30a2\u30bb\u30c3\u30c8", description: "\u30b1\u30a2\u3068\u30ab\u30e9\u30fc\u306e\u30bb\u30c3\u30c8\u30e1\u30cb\u30e5\u30fc" },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("\u3059\u3079\u3066");

  const filtered =
    activeCategory === "\u3059\u3079\u3066"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <>
      {/* Page Header */}
      <section className="py-16 px-4 hero-gradient text-white text-center">
        <p className="text-sm tracking-[0.3em] uppercase mb-2 opacity-90">
          Gallery
        </p>
        <h1 className="text-3xl md:text-4xl font-bold">\u30ae\u30e3\u30e9\u30ea\u30fc</h1>
        <p className="mt-3 opacity-90">\u65bd\u8853\u4e8b\u4f8b\u3092\u3054\u89a7\u304f\u3060\u3055\u3044</p>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <div key={item.id} className="gallery-item group">
                <div className="aspect-square bg-primary-light/30 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <span className="text-5xl opacity-30">&#x1f485;</span>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 rounded-xl">
                    <div className="text-white">
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className="text-xs opacity-80">{item.description}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-primary-dark bg-primary-light/50 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-10">
              \u8a72\u5f53\u3059\u308b\u4f5c\u54c1\u304c\u3042\u308a\u307e\u305b\u3093
            </p>
          )}

          <div className="text-center mt-12">
            <p className="text-gray-500 text-sm mb-2">
              Instagram\u3067\u3082\u6700\u65b0\u306e\u30c7\u30b6\u30a4\u30f3\u3092\u516c\u958b\u4e2d
            </p>
            <p className="text-primary-dark font-semibold">@lumiere_nail</p>
          </div>
        </div>
      </section>
    </>
  );
}

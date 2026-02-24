"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <section className="py-16 px-4 hero-gradient text-white text-center">
          <p className="text-sm tracking-[0.3em] uppercase mb-2 opacity-90">
            Contact
          </p>
          <h1 className="text-3xl md:text-4xl font-bold">\u304a\u554f\u3044\u5408\u308f\u305b</h1>
        </section>
        <section className="py-20 px-4">
          <div className="max-w-lg mx-auto text-center">
            <span className="text-5xl block mb-4">&#x2709;&#xfe0f;</span>
            <h2 className="text-2xl font-bold mb-4">
              \u9001\u4fe1\u3042\u308a\u304c\u3068\u3046\u3054\u3056\u3044\u307e\u3059
            </h2>
            <p className="text-gray-500 mb-8">
              \u5185\u5bb9\u3092\u78ba\u8a8d\u306e\u3046\u3048\u3001\u62c5\u5f53\u8005\u3088\u308a\u3054\u9023\u7d61\u3044\u305f\u3057\u307e\u3059\u3002
              <br />
              \u901a\u5e38\u30012\u55b6\u696d\u65e5\u4ee5\u5185\u306b\u3054\u8fd4\u4fe1\u3044\u305f\u3057\u307e\u3059\u3002
            </p>
            <a
              href="/"
              className="btn-primary inline-block px-8 py-3 rounded-full font-semibold"
            >
              \u30c8\u30c3\u30d7\u30da\u30fc\u30b8\u306b\u623b\u308b
            </a>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Page Header */}
      <section className="py-16 px-4 hero-gradient text-white text-center">
        <p className="text-sm tracking-[0.3em] uppercase mb-2 opacity-90">
          Contact
        </p>
        <h1 className="text-3xl md:text-4xl font-bold">\u304a\u554f\u3044\u5408\u308f\u305b</h1>
        <p className="mt-3 opacity-90">
          \u3054\u8cea\u554f\u30fb\u3054\u76f8\u8ac7\u306f\u304a\u6c17\u8efd\u306b\u3069\u3046\u305e
        </p>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="card p-5">
                <span className="text-2xl block mb-2">&#x1f4de;</span>
                <h3 className="font-semibold mb-1">\u304a\u96fb\u8a71</h3>
                <a
                  href="tel:03-1234-5678"
                  className="text-primary-dark hover:underline text-sm"
                >
                  03-1234-5678
                </a>
                <p className="text-xs text-gray-400 mt-1">
                  \u55b6\u696d\u6642\u9593\u5185\u306b\u304a\u639b\u3051\u304f\u3060\u3055\u3044
                </p>
              </div>
              <div className="card p-5">
                <span className="text-2xl block mb-2">&#x2709;&#xfe0f;</span>
                <h3 className="font-semibold mb-1">\u30e1\u30fc\u30eb</h3>
                <p className="text-primary-dark text-sm">
                  info@lumiere-nail.com
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  2\u55b6\u696d\u65e5\u4ee5\u5185\u306b\u3054\u8fd4\u4fe1
                </p>
              </div>
              <div className="card p-5">
                <span className="text-2xl block mb-2">&#x1f4cd;</span>
                <h3 className="font-semibold mb-1">\u4f4f\u6240</h3>
                <p className="text-sm text-gray-600">
                  \u6771\u4eac\u90fd\u6e0b\u8c37\u533a\u795e\u5bae\u524d1-2-3
                  <br />
                  \u30eb\u30df\u30a8\u30fc\u30eb\u30d3\u30eb 3F
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="card p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    \u304a\u540d\u524d <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    \u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    \u4ef6\u540d <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white"
                  >
                    <option value="">\u9078\u629e\u3057\u3066\u304f\u3060\u3055\u3044</option>
                    <option value="\u30e1\u30cb\u30e5\u30fc\u306b\u3064\u3044\u3066">\u30e1\u30cb\u30e5\u30fc\u306b\u3064\u3044\u3066</option>
                    <option value="\u4e88\u7d04\u306b\u3064\u3044\u3066">\u4e88\u7d04\u306b\u3064\u3044\u3066</option>
                    <option value="\u30ad\u30e3\u30f3\u30bb\u30eb\u30fb\u5909\u66f4">\u30ad\u30e3\u30f3\u30bb\u30eb\u30fb\u5909\u66f4</option>
                    <option value="\u305d\u306e\u4ed6">\u305d\u306e\u4ed6</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    \u304a\u554f\u3044\u5408\u308f\u305b\u5185\u5bb9 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none"
                  />
                </div>
                <div className="text-center pt-2">
                  <button
                    type="submit"
                    className="btn-primary px-10 py-3 rounded-full font-semibold"
                  >
                    \u9001\u4fe1\u3059\u308b
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

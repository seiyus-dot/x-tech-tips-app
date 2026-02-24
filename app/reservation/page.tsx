"use client";

import { useState } from "react";

const menuOptions = [
  "\u30ef\u30f3\u30ab\u30e9\u30fc\u30b8\u30a7\u30eb",
  "\u30b0\u30e9\u30c7\u30fc\u30b7\u30e7\u30f3\u30b8\u30a7\u30eb",
  "\u30d5\u30ec\u30f3\u30c1\u30b8\u30a7\u30eb",
  "\u30c8\u30ec\u30f3\u30c9\u30a2\u30fc\u30c8",
  "\u30cb\u30e5\u30a2\u30f3\u30b9\u30a2\u30fc\u30c8",
  "\u30d5\u30eb\u30a2\u30fc\u30c8",
  "\u30cf\u30f3\u30c9\u30b1\u30a2",
  "\u30d5\u30c3\u30c8\u30b1\u30a2",
  "\u30d5\u30c3\u30c8\u30cd\u30a4\u30eb",
  "\u30b8\u30a7\u30eb\u30aa\u30d5",
  "\u305d\u306e\u4ed6\uff08\u5099\u8003\u6b04\u306b\u8a18\u5165\uff09",
];

const timeSlots = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
];

export default function ReservationPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    menu: "",
    isFirstVisit: "",
    notes: "",
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
            Reservation
          </p>
          <h1 className="text-3xl md:text-4xl font-bold">\u3054\u4e88\u7d04</h1>
        </section>
        <section className="py-20 px-4">
          <div className="max-w-lg mx-auto text-center">
            <span className="text-5xl block mb-4">&#x2705;</span>
            <h2 className="text-2xl font-bold mb-4">
              \u3054\u4e88\u7d04\u3042\u308a\u304c\u3068\u3046\u3054\u3056\u3044\u307e\u3059
            </h2>
            <p className="text-gray-500 mb-2">
              \u3054\u4e88\u7d04\u5185\u5bb9\u3092\u78ba\u8a8d\u306e\u3046\u3048\u3001\u62c5\u5f53\u8005\u3088\u308a\u3054\u9023\u7d61\u3044\u305f\u3057\u307e\u3059\u3002
            </p>
            <p className="text-sm text-gray-400 mb-8">
              \u203b \u901a\u5e38\u30011\u55b6\u696d\u65e5\u4ee5\u5185\u306b\u3054\u9023\u7d61\u3044\u305f\u3057\u307e\u3059\u3002
              \u3054\u9023\u7d61\u304c\u306a\u3044\u5834\u5408\u306f\u304a\u96fb\u8a71\u306b\u3066\u304a\u554f\u3044\u5408\u308f\u305b\u304f\u3060\u3055\u3044\u3002
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
          Reservation
        </p>
        <h1 className="text-3xl md:text-4xl font-bold">\u3054\u4e88\u7d04</h1>
        <p className="mt-3 opacity-90">
          \u30aa\u30f3\u30e9\u30a4\u30f3\u3067\u304b\u3093\u305f\u3093\u306b\u3054\u4e88\u7d04\u3044\u305f\u3060\u3051\u307e\u3059
        </p>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Notice */}
          <div className="card p-4 mb-8 border-l-4 border-primary">
            <p className="text-sm text-gray-500">
              \u203b
              \u304a\u96fb\u8a71\u3067\u306e\u3054\u4e88\u7d04\u3082\u627f\u3063\u3066\u304a\u308a\u307e\u3059\u3002\u304a\u6c17\u8efd\u306b\u304a\u554f\u3044\u5408\u308f\u305b\u304f\u3060\u3055\u3044\u3002
              <br />
              <a
                href="tel:03-1234-5678"
                className="text-primary-dark font-semibold hover:underline"
              >
                TEL: 03-1234-5678
              </a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
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
                placeholder="\u4f8b\uff09\u7530\u4e2d \u82b1\u5b50"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>

            {/* Email */}
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
                placeholder="example@email.com"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                \u96fb\u8a71\u756a\u53f7 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="090-1234-5678"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>

            {/* Date & Time */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  \u3054\u5e0c\u671b\u65e5 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  \u3054\u5e0c\u671b\u6642\u9593 <span className="text-red-500">*</span>
                </label>
                <select
                  name="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white"
                >
                  <option value="">\u9078\u629e\u3057\u3066\u304f\u3060\u3055\u3044</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Menu */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                \u3054\u5e0c\u671b\u30e1\u30cb\u30e5\u30fc <span className="text-red-500">*</span>
              </label>
              <select
                name="menu"
                required
                value={formData.menu}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white"
              >
                <option value="">\u9078\u629e\u3057\u3066\u304f\u3060\u3055\u3044</option>
                {menuOptions.map((menu) => (
                  <option key={menu} value={menu}>
                    {menu}
                  </option>
                ))}
              </select>
            </div>

            {/* First Visit */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                \u5f53\u30b5\u30ed\u30f3\u306e\u3054\u5229\u7528\u306f\u521d\u3081\u3066\u3067\u3059\u304b\uff1f{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isFirstVisit"
                    value="\u306f\u3044"
                    required
                    onChange={handleChange}
                    className="accent-primary"
                  />
                  <span className="text-sm">\u306f\u3044\u3001\u521d\u3081\u3066\u3067\u3059</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isFirstVisit"
                    value="\u3044\u3044\u3048"
                    onChange={handleChange}
                    className="accent-primary"
                  />
                  <span className="text-sm">\u3044\u3044\u3048\u3001\u30ea\u30d4\u30fc\u30bf\u30fc\u3067\u3059</span>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                \u5099\u8003\u30fb\u3054\u8981\u671b
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="\u30c7\u30b6\u30a4\u30f3\u306e\u3054\u5e0c\u671b\u3084\u30a2\u30ec\u30eb\u30ae\u30fc\u306a\u3069\u3001\u304a\u6c17\u8efd\u306b\u3054\u8a18\u5165\u304f\u3060\u3055\u3044"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none"
              />
            </div>

            {/* Submit */}
            <div className="text-center pt-4">
              <button
                type="submit"
                className="btn-primary px-12 py-3 rounded-full font-semibold text-lg"
              >
                \u4e88\u7d04\u3092\u9001\u4fe1\u3059\u308b
              </button>
              <p className="text-xs text-gray-400 mt-3">
                \u203b
                \u78ba\u8a8d\u306e\u3054\u9023\u7d61\u3092\u3082\u3063\u3066\u4e88\u7d04\u78ba\u5b9a\u3068\u306a\u308a\u307e\u3059
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

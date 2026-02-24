import Link from "next/link";

const features = [
  {
    icon: "\u2728",
    title: "\u4e01\u5be7\u306a\u30ab\u30a6\u30f3\u30bb\u30ea\u30f3\u30b0",
    description:
      "\u304a\u5ba2\u69d8\u4e00\u4eba\u3072\u3068\u308a\u306e\u30e9\u30a4\u30d5\u30b9\u30bf\u30a4\u30eb\u3084\u3054\u8981\u671b\u3092\u3058\u3063\u304f\u308a\u4f3a\u3044\u3001\u6700\u9069\u306a\u30c7\u30b6\u30a4\u30f3\u3092\u3054\u63d0\u6848\u3044\u305f\u3057\u307e\u3059\u3002",
  },
  {
    icon: "\u1f48e",
    title: "\u78ba\u304b\u306a\u6280\u8853\u529b",
    description:
      "\u7d4c\u9a13\u8c4a\u5bcc\u306a\u30cd\u30a4\u30ea\u30b9\u30c8\u304c\u3001\u30c8\u30ec\u30f3\u30c9\u304b\u3089\u5b9a\u756a\u307e\u3067\u5e45\u5e83\u3044\u30c7\u30b6\u30a4\u30f3\u3092\u7f8e\u3057\u304f\u4ed5\u4e0a\u3052\u307e\u3059\u3002",
  },
  {
    icon: "\u1f33f",
    title: "\u7a4f\u3084\u304b\u306a\u7a7a\u9593",
    description:
      "\u3042\u306a\u305f\u3060\u3051\u306e\u7279\u5225\u306a\u6642\u9593\u3092\u904e\u3054\u3057\u3066\u3044\u305f\u3060\u3051\u308b\u3088\u3046\u3001\u30ea\u30e9\u30c3\u30af\u30b9\u3067\u304d\u308b\u7a7a\u9593\u3065\u304f\u308a\u306b\u3053\u3060\u308f\u3063\u3066\u3044\u307e\u3059\u3002",
  },
];

const popularMenus = [
  {
    name: "\u30ef\u30f3\u30ab\u30e9\u30fc\u30cd\u30a4\u30eb",
    price: "\u00a55,500\uff5e",
    description: "\u30b7\u30f3\u30d7\u30eb\u3067\u4e0a\u54c1\u306a\u4ed5\u4e0a\u304c\u308a",
  },
  {
    name: "\u30c8\u30ec\u30f3\u30c9\u30a2\u30fc\u30c8\u30cd\u30a4\u30eb",
    price: "\u00a57,700\uff5e",
    description: "\u6700\u65b0\u30c7\u30b6\u30a4\u30f3\u3067\u6307\u5148\u3092\u83ef\u3084\u304b\u306b",
  },
  {
    name: "\u30b8\u30a7\u30eb\u30cd\u30a4\u30eb",
    price: "\u00a56,600\uff5e",
    description: "\u9577\u6301\u3061\u3067\u7f8e\u3057\u3044\u30c4\u30e4\u611f",
  },
  {
    name: "\u30cf\u30f3\u30c9\u30b1\u30a2\u30b3\u30fc\u30b9",
    price: "\u00a53,300\uff5e",
    description: "\u6f64\u3044\u3068\u30c4\u30e4\u306e\u3042\u308b\u6307\u5148\u3078",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center hero-gradient">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10" />
        <div className="relative text-center text-white px-4 animate-fade-in-up">
          <p className="text-sm tracking-[0.3em] uppercase mb-4 opacity-90">
            Nail Salon Lumiere
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            \u6307\u5148\u304b\u3089\u59cb\u307e\u308b\u3001
            <br />
            \u3042\u306a\u305f\u3060\u3051\u306e\u7f8e\u3057\u3055\u3002
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-xl mx-auto">
            \u4e01\u5be7\u306a\u30ab\u30a6\u30f3\u30bb\u30ea\u30f3\u30b0\u3068\u78ba\u304b\u306a\u6280\u8853\u3067\u3001\u7406\u60f3\u306e\u30cd\u30a4\u30eb\u3092\u53f6\u3048\u307e\u3059\u3002
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/reservation"
              className="bg-white text-primary-dark font-semibold px-8 py-3 rounded-full hover:bg-gray-50 transition-colors shadow-lg"
            >
              \u3054\u4e88\u7d04\u306f\u3053\u3061\u3089
            </Link>
            <Link
              href="/menu"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              \u30e1\u30cb\u30e5\u30fc\u3092\u898b\u308b
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary-dark text-sm tracking-widest uppercase mb-2">
              Our Features
            </p>
            <h2 className="text-3xl font-bold">\u30eb\u30df\u30a8\u30fc\u30eb\u306e\u3053\u3060\u308f\u308a</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="card p-8 text-center">
                <span className="text-4xl block mb-4">{feature.icon}</span>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Menu Section */}
      <section className="py-20 px-4 bg-section-bg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary-dark text-sm tracking-widest uppercase mb-2">
              Popular Menu
            </p>
            <h2 className="text-3xl font-bold">\u4eba\u6c17\u30e1\u30cb\u30e5\u30fc</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularMenus.map((menu) => (
              <div key={menu.name} className="card p-6">
                <div className="w-full h-40 bg-primary-light/40 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-5xl">&#x1f485;</span>
                </div>
                <h3 className="font-semibold mb-1">{menu.name}</h3>
                <p className="text-primary-dark font-bold text-lg mb-2">
                  {menu.price}
                </p>
                <p className="text-gray-500 text-sm">{menu.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/menu"
              className="btn-primary inline-block px-8 py-3 rounded-full font-semibold"
            >
              \u30e1\u30cb\u30e5\u30fc\u4e00\u89a7\u3092\u898b\u308b
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary-dark text-sm tracking-widest uppercase mb-2">
              Gallery
            </p>
            <h2 className="text-3xl font-bold">\u65bd\u8853\u4e8b\u4f8b</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="gallery-item aspect-square bg-primary-light/30 rounded-xl flex items-center justify-center"
              >
                <span className="text-4xl opacity-40">&#x1f485;</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/gallery"
              className="btn-primary inline-block px-8 py-3 rounded-full font-semibold"
            >
              \u3082\u3063\u3068\u898b\u308b
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 hero-gradient">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            \u3042\u306a\u305f\u306e\u7406\u60f3\u306e\u30cd\u30a4\u30eb\u3001
            <br />
            \u53f6\u3048\u307e\u305b\u3093\u304b\uff1f
          </h2>
          <p className="text-lg mb-8 opacity-90">
            \u521d\u3081\u3066\u306e\u65b9\u3082\u304a\u6c17\u8efd\u306b\u3054\u4e88\u7d04\u304f\u3060\u3055\u3044\u3002
            <br />
            \u30ab\u30a6\u30f3\u30bb\u30ea\u30f3\u30b0\u304b\u3089\u4e01\u5be7\u306b\u5bfe\u5fdc\u3044\u305f\u3057\u307e\u3059\u3002
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/reservation"
              className="bg-white text-primary-dark font-semibold px-8 py-3 rounded-full hover:bg-gray-50 transition-colors shadow-lg"
            >
              \u30aa\u30f3\u30e9\u30a4\u30f3\u4e88\u7d04
            </Link>
            <a
              href="tel:03-1234-5678"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              TEL: 03-1234-5678
            </a>
          </div>
        </div>
      </section>

      {/* Salon Info Section */}
      <section className="py-20 px-4 bg-section-bg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary-dark text-sm tracking-widest uppercase mb-2">
              Information
            </p>
            <h2 className="text-3xl font-bold">\u30b5\u30ed\u30f3\u60c5\u5831</h2>
          </div>
          <div className="card p-8 max-w-2xl mx-auto">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-100">
                  <th className="py-3 text-left text-gray-500 w-28">\u5e97\u540d</th>
                  <td className="py-3">Nail Salon Lumiere\uff08\u30eb\u30df\u30a8\u30fc\u30eb\uff09</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <th className="py-3 text-left text-gray-500">\u4f4f\u6240</th>
                  <td className="py-3">
                    \u3012150-0001 \u6771\u4eac\u90fd\u6e0b\u8c37\u533a\u795e\u5bae\u524d1-2-3 \u30eb\u30df\u30a8\u30fc\u30eb\u30d3\u30eb 3F
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <th className="py-3 text-left text-gray-500">\u96fb\u8a71</th>
                  <td className="py-3">
                    <a
                      href="tel:03-1234-5678"
                      className="text-primary-dark hover:underline"
                    >
                      03-1234-5678
                    </a>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <th className="py-3 text-left text-gray-500">\u55b6\u696d\u6642\u9593</th>
                  <td className="py-3">10:00 - 20:00\uff08\u6700\u7d42\u53d7\u4ed8 18:30\uff09</td>
                </tr>
                <tr>
                  <th className="py-3 text-left text-gray-500">\u5b9a\u4f11\u65e5</th>
                  <td className="py-3">\u6bce\u9031\u706b\u66dc\u65e5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

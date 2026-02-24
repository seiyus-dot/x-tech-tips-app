import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "\u30e1\u30cb\u30e5\u30fc\u30fb\u6599\u91d1 | Nail Salon Lumiere",
  description: "\u30cd\u30a4\u30eb\u30b5\u30ed\u30f3 \u30eb\u30df\u30a8\u30fc\u30eb\u306e\u30e1\u30cb\u30e5\u30fc\u30fb\u6599\u91d1\u4e00\u89a7\u3002\u30b8\u30a7\u30eb\u30cd\u30a4\u30eb\u3001\u30a2\u30fc\u30c8\u30cd\u30a4\u30eb\u3001\u30b1\u30a2\u30e1\u30cb\u30e5\u30fc\u306a\u3069\u8c4a\u5bcc\u306a\u30e1\u30cb\u30e5\u30fc\u3092\u3054\u7528\u610f\u3002",
};

interface MenuItem {
  name: string;
  price: string;
  description: string;
  duration: string;
}

interface MenuCategory {
  title: string;
  icon: string;
  items: MenuItem[];
}

const menuCategories: MenuCategory[] = [
  {
    title: "\u30b8\u30a7\u30eb\u30cd\u30a4\u30eb",
    icon: "\u2728",
    items: [
      {
        name: "\u30ef\u30f3\u30ab\u30e9\u30fc\u30b8\u30a7\u30eb",
        price: "\u00a55,500",
        description: "\u304a\u597d\u304d\u306a\u30ab\u30e9\u30fc1\u8272\u3067\u30b7\u30f3\u30d7\u30eb\u306b\u4ed5\u4e0a\u3052\u307e\u3059",
        duration: "\u7d0460\u5206",
      },
      {
        name: "\u30b0\u30e9\u30c7\u30fc\u30b7\u30e7\u30f3\u30b8\u30a7\u30eb",
        price: "\u00a56,600",
        description: "\u7f8e\u3057\u3044\u30b0\u30e9\u30c7\u30fc\u30b7\u30e7\u30f3\u3067\u6307\u5148\u306b\u5965\u884c\u304d\u3092",
        duration: "\u7d0475\u5206",
      },
      {
        name: "\u30d5\u30ec\u30f3\u30c1\u30b8\u30a7\u30eb",
        price: "\u00a57,150",
        description: "\u4e0a\u54c1\u306a\u30d5\u30ec\u30f3\u30c1\u30c7\u30b6\u30a4\u30f3\u3067\u6e05\u6f54\u611f\u306e\u3042\u308b\u6307\u5148\u306b",
        duration: "\u7d0480\u5206",
      },
      {
        name: "\u30b8\u30a7\u30eb\u30aa\u30d5\uff08\u4ed6\u5e97\u30aa\u30d5\u542b\u3080\uff09",
        price: "\u00a53,300",
        description: "\u722a\u3092\u50b7\u3081\u305a\u4e01\u5be7\u306b\u30aa\u30d5\u3044\u305f\u3057\u307e\u3059",
        duration: "\u7d0430\u5206",
      },
    ],
  },
  {
    title: "\u30a2\u30fc\u30c8\u30cd\u30a4\u30eb",
    icon: "\u1f3a8",
    items: [
      {
        name: "\u30c8\u30ec\u30f3\u30c9\u30a2\u30fc\u30c8",
        price: "\u00a57,700",
        description: "\u6700\u65b0\u306e\u30c8\u30ec\u30f3\u30c9\u30c7\u30b6\u30a4\u30f3\u3092\u53d6\u308a\u5165\u308c\u305f\u30a2\u30fc\u30c8",
        duration: "\u7d0490\u5206",
      },
      {
        name: "\u30cb\u30e5\u30a2\u30f3\u30b9\u30a2\u30fc\u30c8",
        price: "\u00a58,250",
        description: "\u7e4a\u7d30\u306a\u30cb\u30e5\u30a2\u30f3\u30b9\u8868\u73fe\u3067\u5927\u4eba\u53ef\u611b\u3044\u6307\u5148\u306b",
        duration: "\u7d0490\u5206",
      },
      {
        name: "\u30d5\u30eb\u30a2\u30fc\u30c8(\u30c7\u30b6\u30a4\u30f3\u653e\u984c)",
        price: "\u00a59,900",
        description: "\u3054\u8981\u671b\u306e\u30c7\u30b6\u30a4\u30f3\u3092\u81ea\u7531\u306b\u304a\u4f5c\u308a\u3044\u305f\u3057\u307e\u3059",
        duration: "\u7d04120\u5206",
      },
      {
        name: "\u30ad\u30e3\u30e9\u30af\u30bf\u30fc\u30a2\u30fc\u30c8",
        price: "\u00a5880\uff5e/1\u672c",
        description: "\u304a\u597d\u304d\u306a\u30ad\u30e3\u30e9\u30af\u30bf\u30fc\u3092\u6307\u5148\u306b",
        duration: "\u30c7\u30b6\u30a4\u30f3\u306b\u3088\u308b",
      },
    ],
  },
  {
    title: "\u30b1\u30a2\u30e1\u30cb\u30e5\u30fc",
    icon: "\u1f33f",
    items: [
      {
        name: "\u30cf\u30f3\u30c9\u30b1\u30a2",
        price: "\u00a53,300",
        description: "\u89d2\u8cea\u30b1\u30a2\u30fb\u4fdd\u6e7f\u30fb\u30de\u30c3\u30b5\u30fc\u30b8\u3067\u6f64\u3044\u306e\u3042\u308b\u624b\u5143\u306b",
        duration: "\u7d0430\u5206",
      },
      {
        name: "\u30d5\u30c3\u30c8\u30b1\u30a2",
        price: "\u00a54,400",
        description: "\u8db3\u5148\u306e\u89d2\u8cea\u30b1\u30a2\u3068\u30de\u30c3\u30b5\u30fc\u30b8\u3067\u3059\u3063\u304d\u308a",
        duration: "\u7d0445\u5206",
      },
      {
        name: "\u30d1\u30e9\u30d5\u30a3\u30f3\u30d1\u30c3\u30af",
        price: "\u00a52,200",
        description: "\u6e29\u304b\u3044\u30d1\u30e9\u30d5\u30a3\u30f3\u3067\u6df1\u3044\u4fdd\u6e7f\u3068\u30ea\u30e9\u30c3\u30af\u30b9",
        duration: "\u7d0420\u5206",
      },
      {
        name: "\u30cd\u30a4\u30eb\u30ea\u30da\u30a2",
        price: "\u00a51,100\uff5e",
        description: "\u6b20\u3051\u3084\u5272\u308c\u306e\u5fdc\u6025\u88dc\u4fee\u306b\u5bfe\u5fdc",
        duration: "\u7d0415\u5206\uff5e",
      },
    ],
  },
  {
    title: "\u30d5\u30c3\u30c8\u30cd\u30a4\u30eb",
    icon: "\u1f9b6",
    items: [
      {
        name: "\u30d5\u30c3\u30c8\u30ef\u30f3\u30ab\u30e9\u30fc",
        price: "\u00a56,050",
        description: "\u8db3\u5143\u3092\u7f8e\u3057\u304f\u5f69\u308b\u30b7\u30f3\u30d7\u30eb\u30c7\u30b6\u30a4\u30f3",
        duration: "\u7d0460\u5206",
      },
      {
        name: "\u30d5\u30c3\u30c8\u30a2\u30fc\u30c8",
        price: "\u00a58,250",
        description: "\u8db3\u5143\u3092\u83ef\u3084\u304b\u306b\u5f69\u308b\u30a2\u30fc\u30c8\u30c7\u30b6\u30a4\u30f3",
        duration: "\u7d0490\u5206",
      },
      {
        name: "\u30d5\u30c3\u30c8\u30b1\u30a2\u30b8\u30a7\u30eb\u30bb\u30c3\u30c8",
        price: "\u00a59,350",
        description: "\u30d5\u30c3\u30c8\u30b1\u30a2\u3068\u30b8\u30a7\u30eb\u306e\u304a\u5f97\u306a\u30bb\u30c3\u30c8",
        duration: "\u7d04100\u5206",
      },
    ],
  },
];

export default function MenuPage() {
  return (
    <>
      {/* Page Header */}
      <section className="py-16 px-4 hero-gradient text-white text-center">
        <p className="text-sm tracking-[0.3em] uppercase mb-2 opacity-90">
          Menu & Price
        </p>
        <h1 className="text-3xl md:text-4xl font-bold">\u30e1\u30cb\u30e5\u30fc\u30fb\u6599\u91d1</h1>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Notice */}
          <div className="card p-4 mb-10 border-l-4 border-primary">
            <p className="text-sm text-gray-500">
              \u203b \u8868\u793a\u4fa1\u683c\u306f\u3059\u3079\u3066\u7a0e\u8fbc\u307f\u3067\u3059\u3002\u30c7\u30b6\u30a4\u30f3\u3084\u30d1\u30fc\u30c4\u306e\u8ffd\u52a0\u306b\u3088\u308a\u6599\u91d1\u304c\u5909\u52d5\u3059\u308b\u5834\u5408\u304c\u3054\u3056\u3044\u307e\u3059\u3002
              \u8a73\u3057\u304f\u306f\u30ab\u30a6\u30f3\u30bb\u30ea\u30f3\u30b0\u6642\u306b\u3054\u8aac\u660e\u3044\u305f\u3057\u307e\u3059\u3002
            </p>
          </div>

          {/* Menu Categories */}
          {menuCategories.map((category) => (
            <div key={category.title} className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{category.icon}</span>
                <h2 className="text-2xl font-bold">{category.title}</h2>
              </div>
              <div className="space-y-4">
                {category.items.map((item) => (
                  <div
                    key={item.name}
                    className="card p-5 flex flex-col sm:flex-row sm:items-center gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                          {item.duration}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-primary-dark">
                        {item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div className="text-center mt-10">
            <p className="text-gray-500 mb-4">
              \u30e1\u30cb\u30e5\u30fc\u306b\u8ff7\u3063\u305f\u3089\u304a\u6c17\u8efd\u306b\u3054\u76f8\u8ac7\u304f\u3060\u3055\u3044
            </p>
            <Link
              href="/reservation"
              className="btn-primary inline-block px-8 py-3 rounded-full font-semibold"
            >
              \u3054\u4e88\u7d04\u306f\u3053\u3061\u3089
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

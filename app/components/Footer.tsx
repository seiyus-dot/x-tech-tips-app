import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Salon Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">&#x1f485;</span>
              <div>
                <span className="text-lg font-bold text-white tracking-wide">
                  Lumiere
                </span>
                <span className="text-[10px] text-gray-500 block leading-none">
                  NAIL SALON
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              \u6307\u5148\u304b\u3089\u59cb\u307e\u308b\u3001\u3042\u306a\u305f\u3060\u3051\u306e\u7f8e\u3057\u3055\u3002
              <br />
              \u4e01\u5be7\u306a\u30ab\u30a6\u30f3\u30bb\u30ea\u30f3\u30b0\u3068\u78ba\u304b\u306a\u6280\u8853\u3067\u3001
              <br />
              \u7406\u60f3\u306e\u30cd\u30a4\u30eb\u3092\u53f6\u3048\u307e\u3059\u3002
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">\u30da\u30fc\u30b8\u4e00\u89a7</h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/menu"
                className="text-sm text-gray-400 hover:text-primary transition-colors"
              >
                \u30e1\u30cb\u30e5\u30fc\u30fb\u6599\u91d1
              </Link>
              <Link
                href="/gallery"
                className="text-sm text-gray-400 hover:text-primary transition-colors"
              >
                \u30ae\u30e3\u30e9\u30ea\u30fc
              </Link>
              <Link
                href="/staff"
                className="text-sm text-gray-400 hover:text-primary transition-colors"
              >
                \u30b9\u30bf\u30c3\u30d5\u7d39\u4ecb
              </Link>
              <Link
                href="/reservation"
                className="text-sm text-gray-400 hover:text-primary transition-colors"
              >
                \u3054\u4e88\u7d04
              </Link>
              <Link
                href="/blog"
                className="text-sm text-gray-400 hover:text-primary transition-colors"
              >
                \u30d6\u30ed\u30b0
              </Link>
              <Link
                href="/contact"
                className="text-sm text-gray-400 hover:text-primary transition-colors"
              >
                \u304a\u554f\u3044\u5408\u308f\u305b
              </Link>
            </nav>
          </div>

          {/* Contact / Hours */}
          <div>
            <h3 className="text-white font-semibold mb-4">\u55b6\u696d\u60c5\u5831</h3>
            <div className="text-sm text-gray-400 space-y-2">
              <p>
                <span className="text-gray-300">\u55b6\u696d\u6642\u9593:</span> 10:00 - 20:00
              </p>
              <p>
                <span className="text-gray-300">\u5b9a\u4f11\u65e5:</span> \u6bce\u9031\u706b\u66dc\u65e5
              </p>
              <p>
                <span className="text-gray-300">TEL:</span>{" "}
                <a href="tel:03-1234-5678" className="hover:text-primary transition-colors">
                  03-1234-5678
                </a>
              </p>
              <p>
                <span className="text-gray-300">\u4f4f\u6240:</span>
                <br />
                \u3012150-0001
                <br />
                \u6771\u4eac\u90fd\u6e0b\u8c37\u533a\u795e\u5bae\u524d1-2-3
                <br />
                \u30eb\u30df\u30a8\u30fc\u30eb\u30d3\u30eb 3F
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Nail Salon Lumiere. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

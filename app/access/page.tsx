import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "\u30a2\u30af\u30bb\u30b9\u30fb\u5e97\u8217\u60c5\u5831 | Nail Salon Lumiere",
  description: "\u30cd\u30a4\u30eb\u30b5\u30ed\u30f3 \u30eb\u30df\u30a8\u30fc\u30eb\u3078\u306e\u30a2\u30af\u30bb\u30b9\u65b9\u6cd5\u30fb\u5e97\u8217\u60c5\u5831\u306e\u3054\u6848\u5185\u3002JR\u539f\u5bbf\u99c5\u304b\u3089\u5f92\u6b693\u5206\u3002",
};

export default function AccessPage() {
  return (
    <>
      {/* Page Header */}
      <section className="py-16 px-4 hero-gradient text-white text-center">
        <p className="text-sm tracking-[0.3em] uppercase mb-2 opacity-90">
          Access
        </p>
        <h1 className="text-3xl md:text-4xl font-bold">\u30a2\u30af\u30bb\u30b9\u30fb\u5e97\u8217\u60c5\u5831</h1>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Map */}
            <div>
              <div className="bg-gray-100 rounded-xl h-80 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <span className="text-5xl block mb-2">&#x1f4cd;</span>
                  <p className="text-sm">Google Map</p>
                  <p className="text-xs mt-1">
                    \u5b9f\u969b\u306e\u904b\u7528\u6642\u306b\u306fGoogle Maps\u3092\u57cb\u3081\u8fbc\u307f\u307e\u3059
                  </p>
                </div>
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="card p-6">
                <h2 className="text-xl font-bold mb-5">\u5e97\u8217\u60c5\u5831</h2>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <th className="py-3 text-left text-gray-500 w-24 align-top">
                        \u5e97\u540d
                      </th>
                      <td className="py-3">
                        Nail Salon Lumiere
                        <br />
                        \uff08\u30cd\u30a4\u30eb\u30b5\u30ed\u30f3 \u30eb\u30df\u30a8\u30fc\u30eb\uff09
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <th className="py-3 text-left text-gray-500 align-top">
                        \u4f4f\u6240
                      </th>
                      <td className="py-3">
                        \u3012150-0001
                        <br />
                        \u6771\u4eac\u90fd\u6e0b\u8c37\u533a\u795e\u5bae\u524d1-2-3
                        <br />
                        \u30eb\u30df\u30a8\u30fc\u30eb\u30d3\u30eb 3F
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
                      <td className="py-3">
                        10:00 - 20:00
                        <br />
                        <span className="text-xs text-gray-400">
                          \uff08\u6700\u7d42\u53d7\u4ed8 18:30\uff09
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <th className="py-3 text-left text-gray-500">\u5b9a\u4f11\u65e5</th>
                      <td className="py-3">\u6bce\u9031\u706b\u66dc\u65e5</td>
                    </tr>
                    <tr>
                      <th className="py-3 text-left text-gray-500">\u5e2d\u6570</th>
                      <td className="py-3">3\u5e2d\uff08\u5b8c\u5168\u4e88\u7d04\u5236\uff09</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Access Details */}
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-5">\u30a2\u30af\u30bb\u30b9\u65b9\u6cd5</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="card p-5 text-center">
                <span className="text-3xl block mb-3">&#x1f686;</span>
                <h3 className="font-semibold mb-2">\u96fb\u8eca\u3067\u304a\u8d8a\u3057\u306e\u65b9</h3>
                <p className="text-sm text-gray-500">
                  JR\u5c71\u624b\u7dda \u539f\u5bbf\u99c5
                  <br />
                  \u7af9\u4e0b\u53e3\u304b\u3089\u5f92\u6b693\u5206
                </p>
              </div>
              <div className="card p-5 text-center">
                <span className="text-3xl block mb-3">&#x1f687;</span>
                <h3 className="font-semibold mb-2">\u5730\u4e0b\u9244\u3067\u304a\u8d8a\u3057\u306e\u65b9</h3>
                <p className="text-sm text-gray-500">
                  \u6771\u4eac\u30e1\u30c8\u30ed \u660e\u6cbb\u795e\u5bae\u524d\u99c5
                  <br />
                  5\u756a\u51fa\u53e3\u304b\u3089\u5f92\u6b695\u5206
                </p>
              </div>
              <div className="card p-5 text-center">
                <span className="text-3xl block mb-3">&#x1f697;</span>
                <h3 className="font-semibold mb-2">\u304a\u8eca\u3067\u304a\u8d8a\u3057\u306e\u65b9</h3>
                <p className="text-sm text-gray-500">
                  \u8fd1\u96a3\u306b\u30b3\u30a4\u30f3\u30d1\u30fc\u30ad\u30f3\u30b0\u3042\u308a
                  <br />
                  <span className="text-xs text-gray-400">
                    \u203b\u5c02\u7528\u99d0\u8eca\u5834\u306f\u3054\u3056\u3044\u307e\u305b\u3093
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-5">\u304a\u652f\u6255\u3044\u65b9\u6cd5</h2>
            <div className="card p-5">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>\u1f4b4 \u73fe\u91d1</span>
                <span>\u1f4b3 \u30af\u30ec\u30b8\u30c3\u30c8\u30ab\u30fc\u30c9\uff08VISA / Mastercard / JCB / AMEX\uff09</span>
                <span>\u1f4f1 \u96fb\u5b50\u30de\u30cd\u30fc\uff08PayPay / \u4ea4\u901aIC\uff09</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

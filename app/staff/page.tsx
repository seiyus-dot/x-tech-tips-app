import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "\u30b9\u30bf\u30c3\u30d5\u7d39\u4ecb | Nail Salon Lumiere",
  description: "\u30cd\u30a4\u30eb\u30b5\u30ed\u30f3 \u30eb\u30df\u30a8\u30fc\u30eb\u306e\u30b9\u30bf\u30c3\u30d5\u3092\u3054\u7d39\u4ecb\u3057\u307e\u3059\u3002\u7d4c\u9a13\u8c4a\u5bcc\u306a\u30cd\u30a4\u30ea\u30b9\u30c8\u304c\u304a\u5f85\u3061\u3057\u3066\u3044\u307e\u3059\u3002",
};

interface StaffMember {
  name: string;
  role: string;
  experience: string;
  speciality: string;
  message: string;
  certifications: string[];
}

const staff: StaffMember[] = [
  {
    name: "\u7530\u4e2d \u7f8e\u54b2",
    role: "\u30aa\u30fc\u30ca\u30fc\u30cd\u30a4\u30ea\u30b9\u30c8",
    experience: "\u7d4c\u9a1312\u5e74",
    speciality: "\u30a2\u30fc\u30c8\u30cd\u30a4\u30eb\u30fb\u30d6\u30e9\u30a4\u30c0\u30eb\u30cd\u30a4\u30eb",
    message:
      "\u304a\u5ba2\u69d8\u306e\u300c\u306a\u308a\u305f\u3044\u300d\u3092\u5f62\u306b\u3059\u308b\u3053\u3068\u304c\u79c1\u306e\u559c\u3073\u3067\u3059\u3002\u7d30\u304b\u306a\u3054\u8981\u671b\u3082\u304a\u6c17\u8efd\u306b\u304a\u4f1d\u3048\u304f\u3060\u3055\u3044\u3002\u4e00\u7dd2\u306b\u7406\u60f3\u306e\u30cd\u30a4\u30eb\u3092\u898b\u3064\u3051\u307e\u3057\u3087\u3046\u3002",
    certifications: ["JNA\u8a8d\u5b9a\u8b1b\u5e2b", "JNA\u30cd\u30a4\u30ea\u30b9\u30c8\u6280\u80fd\u691c\u5b9a1\u7d1a", "\u30b8\u30a7\u30eb\u30cd\u30a4\u30eb\u691c\u5b9a\u4e0a\u7d1a"],
  },
  {
    name: "\u9234\u6728 \u7d50\u8863",
    role: "\u30b7\u30cb\u30a2\u30cd\u30a4\u30ea\u30b9\u30c8",
    experience: "\u7d4c\u9a138\u5e74",
    speciality: "\u30b8\u30a7\u30eb\u30cd\u30a4\u30eb\u30fb\u30c8\u30ec\u30f3\u30c9\u30c7\u30b6\u30a4\u30f3",
    message:
      "\u5e38\u306b\u6700\u65b0\u306e\u30c8\u30ec\u30f3\u30c9\u3092\u53d6\u308a\u5165\u308c\u306a\u304c\u3089\u3001\u304a\u5ba2\u69d8\u306b\u5408\u3063\u305f\u30c7\u30b6\u30a4\u30f3\u3092\u3054\u63d0\u6848\u3057\u307e\u3059\u3002\u30ea\u30e9\u30c3\u30af\u30b9\u3067\u304d\u308b\u6642\u9593\u3092\u304a\u5c4a\u3051\u3057\u305f\u3044\u3067\u3059\u3002",
    certifications: ["JNA\u30cd\u30a4\u30ea\u30b9\u30c8\u6280\u80fd\u691c\u5b9a1\u7d1a", "\u30b8\u30a7\u30eb\u30cd\u30a4\u30eb\u691c\u5b9a\u4e0a\u7d1a"],
  },
  {
    name: "\u5c71\u672c \u611b\u83dc",
    role: "\u30cd\u30a4\u30ea\u30b9\u30c8",
    experience: "\u7d4c\u9a134\u5e74",
    speciality: "\u30b7\u30f3\u30d7\u30eb\u30cd\u30a4\u30eb\u30fb\u30b1\u30a2",
    message:
      "\u4e01\u5be7\u306a\u65bd\u8853\u3068\u7b11\u9854\u3067\u304a\u8fce\u3048\u3044\u305f\u3057\u307e\u3059\u3002\u30cd\u30a4\u30eb\u304c\u521d\u3081\u3066\u306e\u65b9\u3082\u5b89\u5fc3\u3057\u3066\u304a\u4efb\u305b\u304f\u3060\u3055\u3044\u3002",
    certifications: ["JNA\u30cd\u30a4\u30ea\u30b9\u30c8\u6280\u80fd\u691c\u5b9a2\u7d1a", "\u30b8\u30a7\u30eb\u30cd\u30a4\u30eb\u691c\u5b9a\u4e2d\u7d1a"],
  },
];

export default function StaffPage() {
  return (
    <>
      {/* Page Header */}
      <section className="py-16 px-4 hero-gradient text-white text-center">
        <p className="text-sm tracking-[0.3em] uppercase mb-2 opacity-90">
          Staff
        </p>
        <h1 className="text-3xl md:text-4xl font-bold">\u30b9\u30bf\u30c3\u30d5\u7d39\u4ecb</h1>
        <p className="mt-3 opacity-90">
          \u7d4c\u9a13\u8c4a\u5bcc\u306a\u30cd\u30a4\u30ea\u30b9\u30c8\u304c\u304a\u5f85\u3061\u3057\u3066\u3044\u307e\u3059
        </p>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-10">
          {staff.map((member) => (
            <div key={member.name} className="card p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Photo placeholder */}
                <div className="w-full md:w-48 h-48 md:h-56 bg-primary-light/30 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-6xl opacity-40">&#x1f469;</span>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold">{member.name}</h2>
                    <span className="text-xs bg-primary-light text-primary-dark px-3 py-1 rounded-full">
                      {member.role}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">
                    {member.experience} | \u5f97\u610f: {member.speciality}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {member.message}
                  </p>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">\u4fdd\u6709\u8cc7\u683c</p>
                    <div className="flex flex-wrap gap-2">
                      {member.certifications.map((cert) => (
                        <span
                          key={cert}
                          className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

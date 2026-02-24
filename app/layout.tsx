import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Nail Salon Lumiere | \u30cd\u30a4\u30eb\u30b5\u30ed\u30f3 \u30eb\u30df\u30a8\u30fc\u30eb",
  description:
    "\u6307\u5148\u304b\u3089\u59cb\u307e\u308b\u3001\u3042\u306a\u305f\u3060\u3051\u306e\u7f8e\u3057\u3055\u3002\u4e01\u5be7\u306a\u30ab\u30a6\u30f3\u30bb\u30ea\u30f3\u30b0\u3068\u78ba\u304b\u306a\u6280\u8853\u3067\u3001\u7406\u60f3\u306e\u30cd\u30a4\u30eb\u3092\u53f6\u3048\u307e\u3059\u3002",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased bg-background text-foreground min-h-screen">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

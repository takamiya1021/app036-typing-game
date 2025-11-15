import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "タイピングゲーム",
  description: "AI搭載タイピング練習アプリ。オフラインでも利用可能",
  manifest: "/manifest.json",
  themeColor: "#1e40af",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "タイピング",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}

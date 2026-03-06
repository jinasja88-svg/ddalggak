import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "딸깍소싱 - 1688 수입대행 소싱 플랫폼",
    template: "%s | 딸깍소싱",
  },
  description:
    "중국 1688 수입대행을 클릭 한 번으로. 실시간 환율 적용, 투명한 수수료, 빠른 배송.",
  keywords: ["딸깍소싱", "1688", "수입대행", "중국직구", "소싱", "도매"],
  openGraph: {
    title: "딸깍소싱 - 1688 수입대행 소싱 플랫폼",
    description: "중국 1688 수입대행을 클릭 한 번으로. 수수료 12%, 실시간 환율.",
    siteName: "딸깍소싱",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&display=swap"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              fontSize: "14px",
              borderRadius: "12px",
              padding: "12px 20px",
            },
          }}
        />
      </body>
    </html>
  );
}

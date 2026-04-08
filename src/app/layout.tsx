import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { CartProvider } from "@/lib/cart/CartContext";
import { ToastProvider } from "@/lib/toast/ToastContext";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Noys 3D Prints | A World Made in Plastic",
  description: "High-detail 3D printed miniatures, custom designs, and hobby-ready models — made to order.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} font-sans h-full antialiased`}
    >
      <body className={`${nunito.variable} font-sans min-h-screen flex flex-col relative z-0 antialiased`}>
        <ToastProvider>
          <CartProvider>
            <AnimatedBackground />
            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
            <CookieBanner />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

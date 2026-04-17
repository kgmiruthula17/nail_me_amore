import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./components/CartProvider";
import { CountryProvider } from "./components/CountryProvider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nail Me Amore | Luxury Press-On Nails",
  description:
    "Handcrafted luxury press-on nails shipped worldwide. Salon-quality nails, ready in minutes. Reusable, long-lasting, and stunningly beautiful.",
  keywords: [
    "press-on nails",
    "luxury nails",
    "handmade nails",
    "nail art",
    "worldwide shipping",
    "reusable nails",
    "international delivery",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        <CountryProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </CountryProvider>
      </body>
    </html>
  );
}

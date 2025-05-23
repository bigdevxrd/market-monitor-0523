import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AppProvider from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Marketplace Monitor - AI-Powered Marketplace Notifications",
  description: "Get instant AI-powered notifications for items from multiple marketplaces including Depop, Facebook Marketplace, eBay, Vinted, and Craigslist.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-neutral-50 text-neutral-900`}>
        <AppProvider>
          {children}
          <Toaster position="top-right" />
        </AppProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./Sidebar";
import RootClient from "./RootClient";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Safe Keep - Digital Curator",
  description: "Secure, architectural space for archiving knowledge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="h-full flex text-on-surface bg-surface font-inter overflow-hidden">
        {/* The Vault - Sidebar Anchor */}
        <RootClient>
          {children}
        </RootClient>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "@/components/SessionProvider";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pawnder — Find Your Pet's Perfect Match",
  description:
    "Swipe. Match. Play. The Tinder-style app for pet owners to find playmates, breeding partners, and adoption matches.",
  openGraph: {
    title: "Pawnder",
    description: "Find your pet's perfect match",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-50">
        <SessionProvider>
          <Navbar />
          <main className="min-h-screen pt-0 md:pt-16 pb-16 md:pb-0">{children}</main>
          <BottomNav />
          <Toaster
            position="top-center"
            toastOptions={{
              className: "text-sm",
              duration: 3000,
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}

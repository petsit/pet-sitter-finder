import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PetSit — Find the best UK pet, equine and rural pros",
  description:
    "Search local, top-rated pet sitters, dog walkers, farriers, livery yards, farm hands, agricultural contractors and more across the UK. Real Google reviews, real ratings.",
  applicationName: "PetSit",
  appleWebApp: {
    title: "PetSit",
    capable: true,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200 mt-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
            <p className="font-medium text-slate-700">
              Pet<span className="text-teal-600">Sit</span>
            </p>
            <p>UK directory for pet, equine and rural pros · Listings powered by Google</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

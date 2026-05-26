import type { Metadata } from "next";
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
        <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
          <p>
            🐾 PetSit — UK directory for pet, equine and rural pros. Powered by Google.
          </p>
        </footer>
      </body>
    </html>
  );
}

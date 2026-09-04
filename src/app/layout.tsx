import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Karla } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const ui = Karla({
  variable: "--font-ui",
  subsets: ["latin"],
});

const serif = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const ticket = IBM_Plex_Mono({
  variable: "--font-ticket",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Sayari — Nairobi's home for people who love shoes",
  description:
    "New-in and ReWear footwear in Nairobi. Closet, Sayari ID, WhatsApp stylist. Join the first 500.",
  icons: {
    icon: "/sayari-mark.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${ui.variable} ${serif.variable} ${ticket.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Archivo_Black, DM_Sans, Space_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const ui = DM_Sans({
  variable: "--font-ui",
  subsets: ["latin"],
});

const rail = Archivo_Black({
  variable: "--font-rail",
  subsets: ["latin"],
  weight: "400",
});

const ticket = Space_Mono({
  variable: "--font-ticket",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Sayari — Found in Nairobi. Worn everywhere.",
  description:
    "Nairobi's thrifted shoe rail. Pre-loved sneakers, loafers, boots — properly checked, priced in KES. One pair only.",
  icons: {
    icon: "/sayari-mark.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${ui.variable} ${rail.variable} ${ticket.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}

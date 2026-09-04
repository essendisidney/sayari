import type { Metadata } from "next";
import { Archivo_Black, DM_Sans, Space_Mono } from "next/font/google";
import { MobileDock } from "@/components/mobile-dock";
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
    "The digital home of Nairobi's thrift shoe culture. Found in Nairobi. Worn everywhere. One pair. One story. One new home.",
  applicationName: "Sayari",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Sayari",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/sayari-mark.png",
    apple: "/sayari-mark.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${ui.variable} ${rail.variable} ${ticket.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper pb-14 text-ink sm:pb-0">
        <SiteHeader />
        {children}
        <SiteFooter />
        <MobileDock />
      </body>
    </html>
  );
}

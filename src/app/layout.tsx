import type { Metadata } from "next";
import "./globals.css";
import Providers from "../components/Providers";
import DynamicTitle from "@/components/DyncamicTitle";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "Encurtador de URLs - FAB",
  description: "Encurtador de URLs para o ambiente intranet da FAB.",
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <body>
        <Providers>
          <DynamicTitle />
          {children}
        </Providers>
      </body>
    </html>
  );
}

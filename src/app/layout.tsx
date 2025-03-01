import type { Metadata } from "next";
import "./globals.css";
import Providers from "../components/Providers";
import DynamicTitle from "@/components/DyncamicTitle";

export const metadata: Metadata = {
  title: "Encurtador de URLs - FAB",
  description: "Encurtador de URLs para o ambiente intraer da FAB.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <DynamicTitle />
          {children}
        </Providers>
      </body>
    </html>
  );
}

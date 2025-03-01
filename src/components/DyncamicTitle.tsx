"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const defaultTitle = "Encurtador de URLs | FAB";

export default function DynamicTitle() {
  const pathname = usePathname();

  useEffect(() => {
    const titles: Record<string, string> = {
      "/login": "Login | Encurtador de URLs | FAB",
      "/list": "Lista de URLs | Encurtador de URLs | FAB",
      "/": "Criar URL | Encurtador de URLs | FAB",
      "/settings": "Configurações | Encurtador de URLs | FAB",
    };

    document.title = titles[pathname] || defaultTitle;
  }, [pathname]);

  return null;
}

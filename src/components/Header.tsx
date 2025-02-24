"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const handleLogout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (window.confirm("Tem certeza que deseja sair?")) {
      window.location.href = "/logout";
    }
  };

  return (
    <header className="bg-transparent shadow text-white py-3">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4">
        {/* Espaçamento Esquerdo */}
        <div className="hidden md:block w-1/6"></div>

        {/* Central - Logos e Nome */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-16 mb-2">
            <Image src="/images/logo-dti.png" alt="DTI" width={50} height={50} />
            <Link href="https://www.fab.mil.br/">
              <Image src="/images/gladio-cinza1.png" alt="FAB" width={111} height={78} />
            </Link>
            <Image src="/images/logo-ccabr.png" alt="CCABR" width={50} height={50} />
          </div>
          <h1 className="text-4xl font-bold uppercase">Força Aérea Brasileira</h1>
        </div>

        {/* Botões */}
        <div className="w-full md:w-1/6 flex justify-center md:justify-end mt-3 md:mt-0">
          <div className="flex gap-3">
            {/* Simulação de autenticação */}
            {true ? (
              <>
                <Link
                  href={pathname === "/" ? "/list" : "/"}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white"
                >
                  {pathname === "/" ? "Lista de URLs" : "Encurtar URL"}
                </Link>

                <form onSubmit={handleLogout}>
                  <button type="submit" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white">
                    Sair
                  </button>
                </form>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

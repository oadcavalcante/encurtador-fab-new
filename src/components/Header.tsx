"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import LogoutModal from "./LogoutModal";

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const toCamelCase = (str: string) => str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

  const userName = session?.user?.name ? toCamelCase(session.user.name) : "Convidado";

  return (
    <header className="bg-transparent shadow text-white py-6">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-6">
          <Image src="/images/logo-dti.png" alt="DTI" width={30} height={30} />
          <Link href="https://www.fab.mil.br/">
            <Image src="/images/gladio-cinza.png" alt="FAB" width={80} height={80} />
          </Link>
          <Image src="/images/logo-ccabr.png" alt="CCABR" width={30} height={30} />
        </div>
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold uppercase">Força Aérea Brasileira</h1>
          <span className="text-lg md:text-xl text-gray-300 mb-2 block">
            Centro de Computação da Aeronáutica de Brasília
          </span>
          <p className="text-gray-200 mt-2">Bem-vindo(a), {userName}</p>
        </div>
        <div className="mt-3 md:mt-0 flex gap-4">
          <Link
            href={pathname === "/" ? "/list" : "/"}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-md text-white font-semibold"
          >
            {pathname === "/" ? "Minhas URLs" : "Encurtar URL"}
          </Link>
          <LogoutModal />
        </div>
      </div>
    </header>
  );
}

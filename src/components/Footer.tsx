import Image from "next/image";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-full flex items-center justify-center h-10 bg-gray-800/10 text-white text-sm backdrop-blur-sm">
      <div className="flex items-center gap-x-2">
        <Image src="/images/logo-ccabr.png" alt="Logo do CCA-BR" width={25} height={25} />
        <span>© Desenvolvido pelo Centro de Computação da Aeronáutica de Brasília - CCA-BR</span>
      </div>
    </footer>
  );
}

"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Credenciais inválidas!");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-blue-900 flex flex-col justify-center items-center text-white p-10">
        <div className="flex gap-8 mb-6 items-center">
          <Image src="/images/logo-dti.png" alt="Logo DTI" width={64} height={64} priority />
          <Image src="/images/gladio-cinza1.png" alt="Logo Força Aérea" width={200} height={80} priority />
          <Image src="/images/logo-ccabr.png" alt="Logo CCA-BR" width={64} height={64} priority />
        </div>
        <h1 className="text-5xl font-bold text-center">Força Aérea Brasileira</h1>
        <h1 className="text-2xl text-center text-gray-300">Centro de Computação da Aeronáutica</h1>
        <p className="text-xl mt-4 text-gray-300">Sistema de Encurtamento de URLs</p>
      </div>
      <div className="w-1/4 bg-gray-800 p-10 flex flex-col justify-center">
        <h2 className="text-4xl font-semibold text-white mb-6 text-center">Acesse sua conta</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md font-semibold transition duration-200"
          >
            Entrar
          </button>
        </form>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}

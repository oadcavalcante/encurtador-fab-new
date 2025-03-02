"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CircularProgress } from "@mui/material";

export default function LoginPage() {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formatCpf = (input) => {
    const numbers = input.replace(/\D/g, "");
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const sanitizedCpf = cpf.replace(/\D/g, "");
    const sanitizedPassword = password.trim();

    if (sanitizedCpf.length !== 11) {
      setError("CPF inválido! Certifique-se de digitar os 11 números.");
      setLoading(false);
      return;
    }

    if (!sanitizedPassword) {
      setError("A senha não pode estar vazia.");
      setLoading(false);
      return;
    }

    const res = await signIn("credentials", {
      cpf: sanitizedCpf,
      password: sanitizedPassword,
      redirect: false,
    });

    if (res?.error) {
      setError("Credenciais inválidas!");
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 bg-blue-900 flex flex-col justify-center items-center text-white p-6 md:p-10">
        <div className="flex flex-wrap gap-4 md:gap-8 mb-6 items-center justify-center">
          <Image
            src="/images/logo-dti.png"
            alt="Logo DTI"
            width={64}
            height={64}
            className="max-w-[50px] md:max-w-[64px]"
          />
          <Image
            src="/images/gladio-cinza.png"
            alt="Logo Força Aérea"
            width={200}
            height={80}
            className="max-w-[120px] md:max-w-[200px] "
          />
          <Image
            src="/images/logo-ccabr.png"
            alt="Logo CCA-BR"
            width={64}
            height={64}
            className="max-w-[50px] md:max-w-[64px]"
          />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-center">Força Aérea Brasileira</h1>
        <h2 className="text-lg md:text-2xl text-center text-gray-300">
          Centro de Computação da Aeronáutica de Brasília
        </h2>
        <p className="text-md md:text-xl mt-2 text-gray-300 text-center">Sistema de Encurtamento de URLs</p>
      </div>

      <div className="w-full md:w-1/3 bg-gray-800 p-6 md:p-10 flex flex-col justify-center items-center">
        <Image
          src="/images/gladio-cinza.png"
          alt="Logo Força Aérea"
          width={120}
          height={48}
          className="hidden md:block mb-4 max-w-[80px] md:max-w-[120px]"
        />
        <h2 className="text-2xl md:text-4xl font-semibold text-white mb-2 text-center">Acesse sua conta</h2>
        <h2 className="text-lg md:text-2xl font-semibold text-white mb-4 text-center">Login único</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-sm">
          <input
            type="text"
            placeholder="CPF (somente números)"
            value={cpf}
            onChange={(e) => setCpf(formatCpf(e.target.value))}
            className="w-full p-3 md:p-4 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
            maxLength={14}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 md:p-4 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
            required
          />
          <button
            type="submit"
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white p-3 md:p-4 rounded-md font-semibold transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {loading && (
          <div className="flex justify-center mt-4">
            <CircularProgress size={24} color="inherit" />
          </div>
        )}

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}

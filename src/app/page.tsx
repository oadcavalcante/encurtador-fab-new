"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ClipboardCheck, Clipboard } from "lucide-react";

export default function Home() {
  const [original, setOriginal] = useState("");
  const [slug, setSlug] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ original, slug }),
    });

    if (res.ok) {
      const data = await res.json();
      setShortUrl(`${window.location.origin}/${data.short}`);
    } else {
      alert("Erro ao encurtar URL.");
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Header />
      <main className="flex flex-col items-center p-8">
        <h1 className="text-4xl text-white mb-6 text-center">Sistema de Encurtamento de URLs</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
          <input
            type="url"
            placeholder="Digite a URL"
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            className="border border-gray-500 p-3 rounded-lg w-full text-black"
            required
          />
          <input
            type="text"
            placeholder="Slug (opcional)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="border border-gray-500 p-3 rounded-lg w-full text-black"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition duration-200 uppercase  "
          >
            Gerar link
          </button>
        </form>

        {shortUrl && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-md flex items-center justify-between max-w-md mx-auto w-full">
            <p className="text-gray-300 font-semibold">Resultado:</p>
            <span className="text-green-400 font-medium bg-gray-900 px-3 py-1 rounded-md transition duration-200 hover:bg-gray-700 hover:text-green-300">
              {shortUrl}
            </span>
            <button onClick={handleCopy} className="ml-3 text-gray-400 hover:text-green-400 transition">
              {copied ? <ClipboardCheck size={20} /> : <Clipboard size={20} />}
            </button>
          </div>
        )}
      </main>

      <section className="w-full max-w-lg text-white p-4 rounded flex flex-col justify-center items-center mx-auto mt-8">
        {[
          { title: "Descrição", content: "O encurtador é uma ferramenta para reduzir URLs e gerar links curtos." },
          {
            title: "Como usar?",
            content:
              "1. Insira a URL Original. 2. Escolha um slug opcional. 3. Clique em 'Gerar link'. 4. Copie e compartilhe.",
          },
          { title: "Pra que serve?", content: "Reduz links longos para facilitar compartilhamento." },
          { title: "Por que usar?", content: "Fácil, intuitivo e amigável para compartilhar." },
        ].map((item, index) => (
          <Accordion key={index} className="w-full">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <strong>{item.title}</strong>
            </AccordionSummary>
            <AccordionDetails>{item.content}</AccordionDetails>
          </Accordion>
        ))}
      </section>
      <Footer />
    </>
  );
}

"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ClipboardCheck, Clipboard, Info, Lightbulb, Link, Share2 } from "lucide-react";
import DOMPurify from "dompurify";

export default function Home() {
  const [original, setOriginal] = useState("");
  const [slug, setSlug] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);

  const sanitizeInput = (input: string) => DOMPurify.sanitize(input.trim());

  const sanitizeSlug = (slug: string) =>
    slug
      .replace(/[^a-zA-Z0-9-_]/g, "")
      .slice(0, 5)
      .trim();

  const normalizeUrl = (url: string) => {
    const sanitizedUrl = sanitizeInput(url);
    return sanitizedUrl && !/^(https?:\/\/)/i.test(sanitizedUrl) ? `https://${sanitizedUrl}` : sanitizedUrl;
  };

  async function checkSlugExists(slug: string) {
    try {
      const res = await fetch(`${window.location.origin}/api/check-slug?slug=${encodeURIComponent(slug)}`);
      if (!res.ok) throw new Error(`Erro: ${res.status}`);
      const data = await res.json();
      return data.exists;
    } catch (error) {
      console.error("Erro ao verificar slug:", error);
      return false;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const normalizedUrl = normalizeUrl(original);
    const sanitizedSlug = sanitizeSlug(slug);

    if (!normalizedUrl) {
      alert("URL inválida!");
      return;
    }

    if (sanitizedSlug) {
      const slugExists = await checkSlugExists(sanitizedSlug);
      if (slugExists) {
        setSlugError("Este slug já está em uso. Escolha outro.");
        return;
      }
      setSlugError(null);
    }

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original: normalizedUrl, slug: sanitizedSlug }),
      });
      if (!res.ok) throw new Error(`Erro: ${res.status}`);
      const data = await res.json();
      setShortUrl(`${window.location.origin}/${data.short}`);
      setSlug("");
    } catch (error) {
      console.error("Erro ao encurtar URL:", error);
      alert("Erro ao encurtar URL.");
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <>
      <Header />
      <main className="flex flex-col items-center p-8">
        <div className="bg-blue-900 bg-opacity-40 p-8 rounded-lg shadow-lg w-full max-w-3xl">
          <h1 className="text-4xl font-bold text-white text-center">Encurtador de URLs</h1>
          <p className="text-lg text-gray-300 text-center mb-6">
            Transforme links longos em URLs curtas e fáceis de compartilhar.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Digite a URL"
              value={original}
              onChange={(e) => setOriginal(e.target.value.trim())}
              className="border border-gray-600 p-3 rounded-lg w-full text-black"
              required
            />

            <div>
              <input
                type="text"
                placeholder="Slug (opcional, máx. 5 caracteres)"
                value={slug}
                onChange={(e) => setSlug(sanitizeSlug(e.target.value))}
                maxLength={5}
                className={`border border-gray-600 p-3 rounded-lg w-full text-black ${
                  slugError ? "border-red-500" : ""
                }`}
              />
              {slugError && <p className="text-red-500 text-sm mt-1">{slugError}</p>}
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition duration-200 uppercase"
            >
              Gerar link
            </button>
          </form>

          {shortUrl && (
            <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-md flex items-center justify-between w-full">
              <p className="text-gray-300 font-semibold">Resultado:</p>

              <span className="text-green-400 font-medium bg-gray-900 px-3 py-1 rounded-md cursor-pointer">
                <a onClick={handleCopy}>{copied ? "Copiado!" : shortUrl}</a>
              </span>

              <button onClick={handleCopy} className="ml-3 text-gray-400 hover:text-green-400 transition">
                {copied ? <ClipboardCheck size={20} /> : <Clipboard size={20} />}
              </button>
            </div>
          )}
        </div>
      </main>

      <section className="w-full max-w-3xl p-6 text-white mx-auto mt-2 pb-32">
        {["Descrição", "Como usar?", "Pra que serve?", "Por que usar?"].map((title, index) => (
          <Accordion key={index} className="w-full">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <span className="flex items-center gap-2">
                {index === 0 ? <Info /> : index === 1 ? <Lightbulb /> : index === 2 ? <Link /> : <Share2 />}
                <strong>{title}</strong>
              </span>
            </AccordionSummary>
            <AccordionDetails>
              {index === 0 && "O encurtador de URLs transforma links longos em versões curtas."}
              {index === 1 && "1. Insira a URL. 2. Escolha um slug opcional. 3. Clique em 'Gerar link'."}
              {index === 2 && "Reduz o tamanho de links extensos, facilitando o compartilhamento."}
              {index === 3 && "Ajuda na estética, economiza caracteres e pode fornecer estatísticas."}
            </AccordionDetails>
          </Accordion>
        ))}
      </section>

      <Footer />
    </>
  );
}

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

  const sanitizeSlug = (slug: string) => {
    const sanitizedSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "").trim();

    if (sanitizedSlug.length < 3 && sanitizedSlug.length > 0) {
      setSlugError("O slug precisa ter pelo menos 3 caracteres.");
    } else if (sanitizedSlug.length > 64) {
      setSlugError("O slug não pode ter mais de 64 caracteres.");
    } else {
      setSlugError(null);
    }
    return sanitizedSlug.slice(0, 64);
  };

  const generateRandomSlug = async () => {
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomSlug = "";
    let exists = true;

    while (exists) {
      randomSlug = Array.from({ length: 5 }, () => characters[Math.floor(Math.random() * characters.length)]).join("");
      exists = await checkSlugExists(randomSlug);
    }

    return randomSlug;
  };

  const normalizeUrl = (url: string) => {
    const sanitizedUrl = sanitizeInput(url);
    const cleanedUrl = sanitizedUrl.replace(/\s+/g, "");

    const urlPattern = /^(https?:\/\/)?([\w.-]+)(:\d+)?(\/\S*)?$/i;
    if (!urlPattern.test(cleanedUrl)) {
      return "";
    }

    return !/^(https?:\/\/)/i.test(cleanedUrl) ? `https://${cleanedUrl}` : cleanedUrl;
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
    let sanitizedSlug = slug.trim() ? sanitizeSlug(slug) : "";

    if (!normalizedUrl) {
      alert("URL inválida!");
      return;
    }

    if (!sanitizedSlug || slugError) {
      sanitizedSlug = await generateRandomSlug();
    } else {
      const slugExists = await checkSlugExists(sanitizedSlug);
      if (slugExists) {
        setSlugError("Este slug já está em uso. Escolha outro.");
        return;
      }
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
              onChange={(e) => setOriginal(e.target.value)}
              className="border border-gray-600 p-3 rounded-lg w-full text-black"
              required
            />
            <div>
              <input
                type="text"
                placeholder="Slug (opcional)"
                value={slug}
                onChange={(e) => setSlug(sanitizeSlug(e.target.value))}
                className={`border border-gray-600 p-3 rounded-lg w-full text-black ${
                  slugError ? "border-red-500" : ""
                }`}
                maxLength={64}
              />
              {slugError && <p className="text-red-500 text-sm mt-1">{slugError}</p>}
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition duration-200 uppercase"
              disabled={(slug.length < 3 && slug !== "") || slugError !== null}
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
              {index === 0 && "O encurtador reduz URLs e gera links curtos."}
              {index === 1 &&
                "1. Insira a URL. 2. Escolha um slug (opcional). 3. Clique em 'Gerar link'. 4. Copie e compartilhe."}
              {index === 2 && "Encurta links para facilitar compartilhamento."}
              {index === 3 && "Links curtos são mais fáceis de lembrar e compartilhar."}
            </AccordionDetails>
          </Accordion>
        ))}
      </section>
      ;
      <Footer />
    </>
  );
}

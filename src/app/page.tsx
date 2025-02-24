"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useState } from "react";

//Accordion
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Home() {
  const [original, setOriginal] = useState("");
  const [slug, setSlug] = useState("");
  const [shortUrl, setShortUrl] = useState("");

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

  return (
    <>
      <Header />
      <main className="flex flex-col items-center p-8">
        <h1 className="text-2xl text-white">Centro de Computação da Aeronáutica de Brasília</h1>
        <h2 className="text-2xl text-white">Encurtador de URLs</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <input
            type="url"
            placeholder="Digite a URL"
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Slug (opcional)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="border p-2 rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            {" "}
            Gerar link{" "}
          </button>
        </form>
        {shortUrl && (
          <p className="mt-4">
            URL Encurtada:{" "}
            <a href={shortUrl} className="text-blue-600">
              {shortUrl}
            </a>
          </p>
        )}
      </main>
      <section className="w-1/2 text-white p-4 rounded flex flex-col justify-center items-center mx-auto mt-8">
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Descrição</AccordionSummary>
          <AccordionDetails>
            O encurtador é uma ferramenta para reduzir URLs e gerar links curtos. Com ele, é possível criar um link
            encurtado fácil de compartilhar.
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Como usar?</AccordionSummary>
          <AccordionDetails>
            <b>1. Insira a URL Original:</b> No campo &apos;URL&apos;, cole ou digite a URL que deseja encurtar.{" "}
            <b>2. Opcional: Escolha um Fragmento Personalizado:</b> Se desejar um fragmento personalizado, digite-o no
            campo correspondente. Caso contrário, o sistema irá gerar um fragmento aleatório de 5 caracteres para você.
            <b>3. Clique em &apos;Gerar link&apos;:</b> Após inserir a URL e, opcionalmente, o fragmento personalizado,
            clique no botão &apos;Gerar link&apos; para processar a sua solicitação. <b>4. Copie e Compartilhe:</b> Uma
            vez que o link encurtado seja gerado com sucesso, ele será exibido na página. Você pode copiá-lo e
            compartilhá-lo facilmente em e-mails, redes sociais, mensagens de texto ou onde desejar!
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Pra que serve?</AccordionSummary>
          <AccordionDetails>
            Em muitas situações, os endereços URL das páginas podem se tornar bastante longos e complicados. Isso pode
            representar um desafio ao compartilhar esses links, seja em sites, e-mails ou em outras formas de
            comunicação online. Para resolver essa questão, entra em cena o encurtador de URL. Essa ferramenta é
            projetada para simplificar endereços URL extensos, reduzindo-os a uma versão muito mais curta e fácil de
            compartilhar.
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Por que usar?</AccordionSummary>
          <AccordionDetails>
            Fácil e intuitivo. O domínio é fácil de memorizar e usar &apos;e.intraer&apos;, tornando seus links
            encurtados mais amigáveis para compartilhar.
          </AccordionDetails>
        </Accordion>
      </section>
      <Footer />
    </>
  );
}

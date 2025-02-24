"use client";

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useState } from "react";

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
      <h1 className="text-2xl font-bold">Encurtador de URL</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <input
          type="url"
          placeholder="Digite a URL"
          value={original}
          onChange={(e) => setOriginal(e.target.value)}
          className="border p-2"
          required
        />
        <input
          type="text"
          placeholder="Slug (opcional)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2"> Encurtar </button>
      </form>
      {shortUrl && (
        <p className="mt-4">
          URL Encurtada: <a href={shortUrl} className="text-blue-600">{shortUrl}</a>
        </p>
      )}
    </main>
    <Footer />
    </>
  );
}

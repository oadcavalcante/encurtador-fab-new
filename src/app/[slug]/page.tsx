
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function RedirectPage({ params }: { params: { slug: string } }) {
  const { slug } = params; // <-- Desestruture antes de usar

  if (!slug) {
    notFound();
  }

  const url = await prisma.uRL.findUnique({
    where: { short: slug },
  });

  if (!url) {
    notFound(); // Redireciona para uma página de erro 404
  }

  redirect(url.original); // Redireciona para a URL original
}

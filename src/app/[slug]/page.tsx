import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function RedirectPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug) {
    notFound();
  }

  const url = await prisma.uRL.findUnique({
    where: { short: slug },
  });

  if (!url) {
    notFound();
  }

  redirect(url.original);
}

import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Params = {
  slug: string;
};

type PageProps = {
  params: Promise<Params>;
};

export default async function RedirectPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const url = await prisma.uRL.findUnique({
    where: { short: slug },
  });

  if (!url) {
    notFound();
  }

  await prisma.uRL.update({
    where: { short: slug },
    data: { clicks: url.clicks + 1 },
  });

  redirect(url.original);
}

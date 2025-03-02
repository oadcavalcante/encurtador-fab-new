import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const schema = z.object({
    original: z.string().url(),
    slug: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const body = await req.json();
        const { original, slug } = schema.parse(body);
        const short = slug || nanoid(6);

        const existing = await prisma.uRL.findUnique({ where: { short } });
        if (existing) {
            return NextResponse.json({ error: "Slug já existe." }, { status: 400 });
        }

        const url = await prisma.uRL.create({
            data: { original, short, userId: session.user.id }, // Associa ao usuário autenticado
        });

        return NextResponse.json(url);
    } catch (error) {
        console.error("Erro ao encurtar URL:", error);
        return NextResponse.json({ error: "Erro ao encurtar URL" }, { status: 400 });
    }
}

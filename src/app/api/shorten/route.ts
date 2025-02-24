import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { nanoid } from "nanoid";

const schema = z.object({
    original: z.string().url(),
    slug: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { original, slug } = schema.parse(body);

        let short = slug || nanoid(6);

        // Verifica se o slug já existe
        const existing = await prisma.uRL.findUnique({ where: { short } });
        if (existing) {
            return NextResponse.json({ error: "Slug já existe." }, { status: 400 });
        }

        const url = await prisma.uRL.create({
            data: { original, short },
        });

        return NextResponse.json(url);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao encurtar URL" }, { status: 400 });
    }
}
